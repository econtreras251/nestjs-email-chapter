import { registerAs } from "@nestjs/config";
import { validateSync } from "class-validator";
import { BaseConfig } from "./validation/base-config.class";

export const baseConfig = registerAs("base", () => {
  const value = BaseConfig.fromPlain({
    port: process.env.PORT,
  });
  validateSync(value);
  return value;
});
