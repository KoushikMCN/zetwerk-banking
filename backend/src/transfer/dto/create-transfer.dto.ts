import { IsNumberString, IsString, Length } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @Length(10, 20)
  destinationAccountNumber: string;

  @IsNumberString()
  amount: string;
}