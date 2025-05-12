import { ValueOf } from "type-fest";

export type Template = ValueOf<typeof TEMPLATES>;

export const TEMPLATES = {
  WELCOME: "WELCOME",
  VERIFICATION: "VERIFICATION",
} as const;

export const TEMPLATE_PATHS = {
  [TEMPLATES.WELCOME]: "templates/welcome.pug",
  [TEMPLATES.VERIFICATION]: "templates/verification.pug",
} as const;

export const TEMPLATE_FILENAMES = {
  [TEMPLATES.WELCOME]: "Welcome aboard",
  [TEMPLATES.VERIFICATION]: "Verify your email",
} as const;
