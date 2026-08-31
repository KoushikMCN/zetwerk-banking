import { Request } from 'express';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/common';

import { TransactionQueryDto } from './dto/transaction-query.dto';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAccount(@Req() req: AuthenticatedRequest) {
    return this.accountService.getAccount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  getTransactions(
    @Req() req: AuthenticatedRequest,
    @Query() query: TransactionQueryDto,
  ) {
    return this.accountService.getTransactions(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions/recent')
  getRecentTransactions(@Req() req: AuthenticatedRequest) {
    return this.accountService.getRecentTransactions(req.user.userId);
  }
}
