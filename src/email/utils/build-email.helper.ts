import { TemplateEmailParams } from "../types/email-config.types";
import { emailTypesConfig } from "../../templates/index";

/**
 * Helper function to build type-safe email parameters using the configured email types.
 * The function is bound to the application's email configuration (emailTypesConfig).
 *
 * @param template - The template key from emailTypesConfig.templates (e.g., 'WELCOME', 'VERIFICATION')
 * @param params - The parameters required for the specific template
 * @param options - Additional email options (to, subject, etc.)
 * @returns Type-safe email parameters for the specified template
 *
 * @example
 * ```typescript
 * const emailParams = buildEmailParams(
 *   'WELCOME',
 *   { name: "John" },
 *   {
 *     to: "john@example.com",
 *     subject: "Welcome aboard!"
 *   }
 * );
 * ```
 */
export function buildEmailParams<
  T extends keyof (typeof emailTypesConfig)["templates"],
>(
  template: T,
  params: (typeof emailTypesConfig)["params"][T],
  options: Omit<TemplateEmailParams<typeof emailTypesConfig, T>, "template">,
): TemplateEmailParams<typeof emailTypesConfig, T> {
  return {
    ...options,
    template: {
      name: template,
      params,
    },
  };
}
