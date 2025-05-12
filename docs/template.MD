## Template handling

This document describes the template handling strategy for the email module, focusing on local template management and its integration with the SendGrid adapter.

### Template Declaration

The template system is designed to be type-safe and maintainable. Here's how templates are declared:

```typescript
export const TEMPLATES = {
  WELCOME: 'WELCOME',
} as const;

export type Template = ValueOf<typeof TEMPLATES>;

export const TEMPLATE_PATHS = {
  [TEMPLATES.WELCOME]: 'templates/welcome.<pug/hbs/html>',
} as const;

export const TEMPLATE_FILENAMES = {
  [TEMPLATES.WELCOME]: 'Welcome aboard',
} as const;

export interface TemplateParams {
  [TEMPLATES.WELCOME]: WelcomeParams;
}
```

### Template Structure

1. **TEMPLATES**: A constant object that defines all available template identifiers
2. **TEMPLATE_PATHS**: Maps template identifiers to their file paths
3. **TEMPLATE_FILENAMES**: Maps template identifiers to their display names
4. **TemplateParams**: Type-safe interface for template parameters

### Service Integration

The template system integrates with the SendGrid adapter through the following interface:

```typescript
/**
 * Parameters to render a template
 *
 * @prop {T extends Template} name - The template name.
 * @prop {TemplateParams[T]} params - The params required by the template.
 */
interface RenderFromTemplateParams<T extends Template> {
  name: T;
  params: TemplateParams[T];
}
```

### Local Template Handling

For local templates (Handlebars, Pug, HTML), the system follows these principles:

1. **Template Location**: Templates are stored in a dedicated `templates` directory
2. **Template Format**: Supports multiple formats:
   - Handlebars (.hbs)
   - Pug (.pug)
   - HTML (.html)
3. **Template Compilation**: Templates are compiled at runtime using their respective engines
4. **Type Safety**: All template parameters are strictly typed

### Integration with SendGrid Adapter

The SendGrid adapter handles templates in two ways:

1. **Local Templates**: 
   - Templates are compiled locally
   - HTML output is sent directly to SendGrid
   - Maintains full control over template rendering

2. **SendGrid Templates**:
   - Uses SendGrid's template system
   - Templates are managed in SendGrid's dashboard
   - Template IDs are used instead of local files

### Best Practices

1. **Template Organization**:
   - Keep templates in a dedicated directory
   - Use consistent naming conventions
   - Group related templates in subdirectories

2. **Type Safety**:
   - Always define template parameters interfaces
   - Use strict typing for template names
   - Validate template parameters at compile time

3. **Template Maintenance**:
   - Document template parameters
   - Keep templates DRY (Don't Repeat Yourself)
   - Use template inheritance when possible

### Future Considerations

1. **Template Caching**: Implement caching for compiled templates
2. **Template Versioning**: Add version control for templates
3. **Template Testing**: Add unit tests for template rendering
4. **Template Preview**: Add preview functionality for templates