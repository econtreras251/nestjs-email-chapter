import { registerAs } from "@nestjs/config";
import { validate } from "class-validator";
import { EmailConfig } from "./validation/email-config.class";

export const emailConfig = registerAs("email", () => {
  const value = EmailConfig.fromPlain({
    emailFrom: process.env.EMAIL_FROM,
    sendgridApiKey: process.env.SENDGRID_API_KEY
  });
  validate(value);
  return value;
});
