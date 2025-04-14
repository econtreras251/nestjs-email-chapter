import { registerAs } from "@nestjs/config";
import { validateSync } from "class-validator";
import { EmailConfig } from "./validation/email-config.class";

export const emailConfig = registerAs("email", () => {
  const value = EmailConfig.fromPlain({
    emailFrom: process.env.EMAIL_FROM,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  });
  validateSync(value);
  return value;
});
