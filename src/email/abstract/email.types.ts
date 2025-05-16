import { SendEmailParams } from "../abstract/email.interface";

/**
 * Type helper to create a type-safe email configuration.
 * @typeParam TEMPLATES - The template object type (e.g., typeof TEMPLATES)
 * @typeParam PARAMS - The mapping of template names to their parameter types
 */
export type EmailConfig<
  TEMPLATES extends Record<string, string>,
  PARAMS extends Record<TEMPLATES[keyof TEMPLATES], Record<string, any>>,
> = {
  templates: TEMPLATES;
  params: PARAMS;
};

/**
 * Type helper to create a type-safe email params for a specific template.
 * @typeParam C - The email configuration type
 * @typeParam T - The specific template name from the config
 */
export type TemplateEmailParams<
  C extends EmailConfig<any, any>,
  T extends C["templates"][keyof C["templates"]],
> = Omit<SendEmailParams, "template"> & {
  template: {
    name: T;
    params: C["params"][T];
  };
};

/**
 * Type helper to create a type-safe email params for any template in the configuration.
 * @typeParam C - The email configuration type
 */
export type ConfiguredEmailParams<C extends EmailConfig<any, any>> =
  TemplateEmailParams<C, C["templates"][keyof C["templates"]]>;
