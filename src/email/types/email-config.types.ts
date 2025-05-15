import { SendEmailParams } from '../abstract/email.interface';

/**
 * Type helper to create a type-safe email configuration.
 * @typeParam TEMPLATES - The template object type (e.g., typeof TEMPLATES)
 * @typeParam PARAMS - The mapping of template names to their parameter types
 */
export type EmailConfig<
  TEMPLATES extends Record<string, string>,
  PARAMS extends Record<TEMPLATES[keyof TEMPLATES], Record<string, any>>
> = {
  templates: TEMPLATES;
  params: PARAMS;
};

/**
 * Type helper to create a type-safe email params for a specific configuration.
 * @typeParam CONFIG - The email configuration type
 */
export type ConfiguredEmailParams<CONFIG extends EmailConfig<any, any>> = Omit<
  SendEmailParams,
  'template'
> & {
  template: {
    name: CONFIG['templates'][keyof CONFIG['templates']];
    params: CONFIG['params'][CONFIG['templates'][keyof CONFIG['templates']]];
  };
}; 