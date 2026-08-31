import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
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
      throw new NotFoundException('Account not found');
    }

    return {
      ...account,
      balance: account.balance.toString(),
    };
  }

  async getTransactions(userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const transactions = await this.prisma.transaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        amount: true,
        balanceAfter: true,
        createdAt: true,
        transfer: {
          select: {
            id: true,
            sourceAccountId: true,
            destinationAccountId: true,
          },
        },
      },
    });

    return transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toString(),
      balanceAfter: transaction.balanceAfter.toString(),
    }));
  }
}
