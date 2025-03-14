import { registerAs } from '@nestjs/config';
import { validate } from 'class-validator';
import { BaseConfig } from './validation/base-config.class';

export const baseConfig = registerAs('base', () => {
  const value = BaseConfig.fromPlain({
    port: process.env.PORT,
  });
  validate(value);
  return value;
});
