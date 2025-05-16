import { EmailConfig } from "src/email/abstract/email.types";
import { TemplateParamsMap } from "./template-params.interface";
import { WelcomeParams } from "./onboarding/welcome.interface";
import { VerificationParams } from "./auth/verification.interface";

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
