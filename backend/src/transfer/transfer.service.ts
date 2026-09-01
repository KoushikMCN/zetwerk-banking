import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

import { Prisma, Transfer } from '../generated/prisma/client';

import { formatMoney } from '../common/utils/money.util';

@Injectable()
export class TransferService {
  private readonly logger = new Logger(TransferService.name);

  constructor(private readonly prisma: PrismaService) {}

  async transfer(
    userId: string,
    dto: CreateTransferDto,
    idempotencyKey: string,
  ) {
    if (!idempotencyKey || idempotencyKey.length > 100) {
      throw new BadRequestException(
        'A valid Idempotency-Key header is required',
      );
    }

    const amount = this.parseAmount(dto.amount);

    this.logger.log(`Transfer initiated by user: ${userId}`);

    const sourceAccount = await this.prisma.account.findUnique({
      where: { userId },
    });

    if (!sourceAccount) {
      throw new NotFoundException('Source account not found');
    }

    const destinationAccount = await this.prisma.account.findUnique({
      where: {
        accountNumber: dto.destinationAccountNumber,
      },
    });

    if (!destinationAccount) {
      throw new NotFoundException('Destination account not found');
    }

    if (sourceAccount.id === destinationAccount.id) {
      throw new BadRequestException(
        'Cannot transfer money to the same account',
      );
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const existingTransfer = await tx.transfer.findUnique({
          where: { idempotencyKey },
        });

        if (existingTransfer) {
          this.logger.log(`Idempotent transfer replay for user: ${userId}`);
          return this.serializeTransfer(existingTransfer);
        }

        const accountIds = [sourceAccount.id, destinationAccount.id].sort();

        const lockedAccounts = await tx.$queryRaw<
          { id: string; balance: bigint }[]
        >`
        SELECT id, balance
        FROM accounts
        WHERE id IN (${accountIds[0]}::uuid, ${accountIds[1]}::uuid)
        ORDER BY id
        FOR UPDATE
      `;

        const lockedSource = lockedAccounts.find(
          (account) => account.id === sourceAccount.id,
        );

        const lockedDestination = lockedAccounts.find(
          (account) => account.id === destinationAccount.id,
        );

        if (!lockedSource || !lockedDestination) {
          throw new NotFoundException('Account not found');
        }

        if (lockedSource.balance < amount) {
          throw new BadRequestException('Insufficient balance');
        }

        const newSourceBalance = lockedSource.balance - amount;
        const newDestinationBalance = lockedDestination.balance + amount;

        await tx.account.update({
          where: { id: sourceAccount.id },
          data: { balance: newSourceBalance },
        });

        await tx.account.update({
          where: { id: destinationAccount.id },
          data: { balance: newDestinationBalance },
        });

        const transfer = await tx.transfer.create({
          data: {
            sourceAccountId: sourceAccount.id,
            destinationAccountId: destinationAccount.id,
            amount,
            currency: sourceAccount.currency,
            idempotencyKey,
          },
        });

        await tx.transaction.createMany({
          data: [
            {
              accountId: sourceAccount.id,
              transferId: transfer.id,
              type: 'DEBIT',
              amount,
              balanceAfter: newSourceBalance,
            },
            {
              accountId: destinationAccount.id,
              transferId: transfer.id,
              type: 'CREDIT',
              amount,
              balanceAfter: newDestinationBalance,
            },
          ],
        });

        this.logger.log(
          `Transfer completed: ${transfer.id} for user: ${userId}`,
        );

        return this.serializeTransfer(transfer);
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const driverError = error.meta?.driverAdapterError;

        const constraintName =
          driverError &&
          typeof driverError === 'object' &&
          'cause' in driverError &&
          driverError.cause &&
          typeof driverError.cause === 'object' &&
          'constraint' in driverError.cause &&
          driverError.cause.constraint &&
          typeof driverError.cause.constraint === 'object' &&
          'index' in driverError.cause.constraint
            ? driverError.cause.constraint.index
            : undefined;

        if (constraintName === 'transfers_idempotency_key_key') {
          const existingTransfer = await this.prisma.transfer.findUnique({
            where: { idempotencyKey },
          });

          if (existingTransfer) {
            return this.serializeTransfer(existingTransfer);
          }
        }
      }

      throw error;
    }
  }

  private parseAmount(value: string): bigint {
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      throw new BadRequestException(
        'Amount must be a valid positive monetary value',
      );
    }

    const [rupees, paise = ''] = value.split('.');
    const normalizedPaise = paise.padEnd(2, '0');

    const amount = BigInt(rupees) * 100n + BigInt(normalizedPaise || '0');

    if (amount <= 0n) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    return amount;
  }

  private serializeTransfer(transfer: Transfer) {
    return {
      id: transfer.id,
      sourceAccountId: transfer.sourceAccountId,
      destinationAccountId: transfer.destinationAccountId,
      amount: formatMoney(transfer.amount),
      currency: transfer.currency,
      status: transfer.status,
      createdAt: transfer.createdAt,
    };
  }
}
