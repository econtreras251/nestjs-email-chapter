import { EmailConfig } from "src/email/types/email-config.types";
import { VerificationParams } from "./verification.interface";
import { WelcomeParams } from "./welcome.interface";

export type Template = (typeof TEMPLATES)[keyof typeof TEMPLATES];

export const TEMPLATES = {
  WELCOME: "WELCOME",
  VERIFICATION: "VERIFICATION",
} as const;

export const TEMPLATE_PATHS = {
  [TEMPLATES.WELCOME]: "templates/welcome.pug",
  [TEMPLATES.VERIFICATION]: "src/templates/verification.pug",
} as const;

export const TEMPLATE_SUBJECTS = {
  [TEMPLATES.WELCOME]: "Welcome aboard",
  [TEMPLATES.VERIFICATION]: "Verify your email",
} as const;

export interface TemplateParamsMap {
  [TEMPLATES.WELCOME]: WelcomeParams;
  [TEMPLATES.VERIFICATION]: VerificationParams;
}

export const emailTypesConfig: EmailConfig<
  typeof TEMPLATES,
  TemplateParamsMap
> = {
  templates: TEMPLATES,
  params: {
    [TEMPLATES.WELCOME]: {} as WelcomeParams,
    [TEMPLATES.VERIFICATION]: {} as VerificationParams,
  },
};
