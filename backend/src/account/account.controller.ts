import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

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
  getTransactions(@Req() req: AuthenticatedRequest) {
    return this.accountService.getTransactions(req.user.userId);
  }
}
