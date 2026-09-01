import { Injectable, NotFoundException, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { formatMoney } from '../common/utils/money.util';
import { TransactionQueryDto } from './dto/transaction-query.dto';

const transactionSelect = {
  id: true,
  type: true,
  amount: true,
  balanceAfter: true,
  createdAt: true,
  transfer: {
    select: {
      id: true,
      sourceAccount: {
        select: {
          accountNumber: true,
        },
      },
      destinationAccount: {
        select: {
          accountNumber: true,
        },
      },
    },
  },
} satisfies Prisma.TransactionSelect;

type TransactionWithTransfer = Prisma.TransactionGetPayload<{
  select: typeof transactionSelect;
}>;

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAccount(userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { userId },
      select: {
        accountNumber: true,
        balance: true,
        currency: true,
        createdAt: true,
      },
    });

    if (!account) {
      this.logger.warn(`Account not found for user: ${userId}`);
      throw new NotFoundException('Account not found');
    }

    return {
      ...account,
      balance: formatMoney(account.balance),
    };
  }

  async getTransactions(userId: string, query: TransactionQueryDto) {
    const account = await this.getAccountId(userId);

    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { accountId: account.id },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip,
        take: limit,
        select: transactionSelect,
      }),

      this.prisma.transaction.count({
        where: { accountId: account.id },
      }),
    ]);

    return {
      data: this.serializeTransactions(transactions),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRecentTransactions(userId: string) {
    const account = await this.getAccountId(userId);

    const transactions = await this.prisma.transaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: transactionSelect,
    });

    return this.serializeTransactions(transactions);
  }

  private async getAccountId(userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  private serializeTransactions(transactions: TransactionWithTransfer[]) {
    return transactions.map((transaction) => ({
      ...transaction,
      amount: formatMoney(transaction.amount),
      balanceAfter: formatMoney(transaction.balanceAfter),
    }));
  }
}
