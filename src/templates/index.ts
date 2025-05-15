import { VerificationParams } from "./verification.interface";
import { WelcomeParams } from "./welcome.interface";

export type Template = (typeof TEMPLATES)[keyof typeof TEMPLATES];

export const TEMPLATES = {
  WELCOME: "WELCOME",
  VERIFICATION: "VERIFICATION",
} as const;

export const TEMPLATE_PATHS = {
  [TEMPLATES.WELCOME]: "src/email/templates/welcome.pug",
  [TEMPLATES.VERIFICATION]: "src/email/templates/verification.pug",
} as const;

export const TEMPLATE_FILENAMES = {
  [TEMPLATES.WELCOME]: "Welcome aboard",
  [TEMPLATES.VERIFICATION]: "Verify your email",
} as const;

export interface TemplateParamsMap {
  [TEMPLATES.WELCOME]: WelcomeParams;
  [TEMPLATES.VERIFICATION]: VerificationParams;
}
