import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
        },
      });

      await tx.account.create({
        data: {
          userId: newUser.id,
          accountNumber: await this.generateAccountNumber(tx),
        },
      });

      return newUser;
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  private async generateAccountNumber(
    tx: Prisma.TransactionClient,
  ): Promise<string> {
    const number = randomInt(10000000, 100000000);

    const accountNumber = `ACC${number}`;

    const existing = await tx.account.findUnique({
      where: { accountNumber },
    });

    if (existing) {
      return this.generateAccountNumber(tx);
    }

    return accountNumber;
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
    };
  }
}
