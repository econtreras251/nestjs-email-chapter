import { IsInt } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class BaseConfig {
  @IsInt()
  port!: number;

  static fromPlain(plain: Record<string, any>): BaseConfig {
    return plainToInstance(BaseConfig, plain);
  }
} 