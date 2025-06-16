## Architecture Overview

This project implements a modular, provider-agnostic email system for NestJS, following the Abstract Interface pattern and leveraging a flexible template system.

### Email Provider Structure

The email system is built around an abstract service and a template service, allowing you to easily swap providers (like Sendgrid, AWS SES, etc.) and manage templates in a type-safe, scalable way.

#### Key Components

1. **Abstract Email Service (`EmailService`)**
   ```typescript
   export abstract class EmailService {
     constructor(protected templateService: EmailTemplateService) {}
     abstract sendEmail(params: SendRenderedEmailParams): Promise<MailingResponse>;
     abstract sendEmailMultiple(params: SendRenderedEmailMultipleParams): Promise<MailingResponse>;
     async renderTemplate(params: RenderEmailTemplateParams<...>): Promise<RenderedEmailContent>;
   }
   ```
   - All providers must extend this class and implement the required methods.

2. **Template Service (`EmailTemplateService`)**
   ```typescript
   export abstract class EmailTemplateService {
     abstract compile(templatePath: string, context: any): Promise<string>;
   }
   ```
   - Providers use this to render templates with dynamic data.

3. **Provider Adapters**
   - Located in `src/email/sendgrid-adapter/` (or similar for other providers).
   - Example: `SendgridAdapterService` extends `EmailService` and implements provider-specific logic.
   - Registered via a module, e.g.:
     ```typescript
     @Module({})
     export class SendgridAdapterModule {
       static register(config: SendgridAdapterConfig): DynamicModule { ... }
     }
     ```

4. **Abstract Module Registration**
   - The `EmailAbstractModule` composes the provider and template service:
     ```typescript
     EmailAbstractModule.forRoot({
       adapter: SendgridAdapterModule.register({ ... }),
       templateService: PugCompilerModule, // or your custom template module
     })
     ```

### Project Structure

```
src/email/
├── abstract/
│   ├── email.service.ts
│   ├── email.interface.ts
│   ├── templates.abstract.ts
│   └── email-abstract.module.ts
├── sendgrid-adapter/
│   ├── sendgrid-adapter.service.ts
│   └── sendgrid-adapter.module.ts
```

### Usage

1. **Register the Email Module in your app:**
   ```typescript
   @Module({
     imports: [
       EmailAbstractModule.forRoot({
         adapter: SendgridAdapterModule.register({
           sendgridApiKey: process.env.SENDGRID_API_KEY,
           emailFrom: 'noreply@example.com',
         }),
         templateService: PugCompilerModule, // or your template engine
       }),
     ],
   })
   export class AppModule {}
   ```

2. **Inject the email service using the abstract class:**
   ```typescript
   constructor(private readonly emailService: EmailService) {}
   ```

3. **Send an email:**
   ```typescript
   await this.emailService.sendEmail({
     to: 'user@example.com',
     subject: 'Welcome!',
     content: {
       html: '<b>Hello!</b>',
     },
   });
   ```

### Adding New Providers

1. Create a new adapter in `src/email/your-provider-adapter/`
2. Extend the `EmailService` abstract class and implement the required methods.
3. Register your adapter module in `EmailAbstractModule.forRoot`.

---

## Template Management

Templates are managed in a type-safe, centralized way:

- **Template Constants and Paths**
  ```typescript
  export const TEMPLATES = {
    WELCOME: "WELCOME",
    VERIFICATION: "VERIFICATION",
  } as const;

  export const TEMPLATE_PATHS = {
    [TEMPLATES.WELCOME]: "src/templates/onboarding/welcome.pug",
    [TEMPLATES.VERIFICATION]: "src/templates/auth/verification.pug",
  } as const;
  ```

- **Template Parameter Types**
  ```typescript
  export interface TemplateParamsMap {
    [TEMPLATES.WELCOME]: WelcomeParams;
    [TEMPLATES.VERIFICATION]: VerificationParams;
  }
  ```

- **Example Template Params**
  ```typescript
  // onboarding/welcome.interface.ts
  export interface WelcomeParams { name: string; }

  // auth/verification.interface.ts
  export interface VerificationParams { name: string; verificationUrl: string; }
  ```

- **Rendering a Template**
  ```typescript
  const rendered = await emailService.renderTemplate({
    name: TEMPLATES.WELCOME,
    params: { name: "Alice" },
  });
  ```

- **Adding a New Template**
  1. Add your `.pug` file in the appropriate directory.
  2. Add a new entry to `TEMPLATES`, `TEMPLATE_PATHS`, and `TEMPLATE_SUBJECTS`.
  3. Define the params interface and add it to `TemplateParamsMap`.

---

## Pug Compiler Module (`@/pug-compiler`)

The `pug-compiler` module provides a concrete implementation of the `EmailTemplateService` using the [pug](https://pugjs.org/) templating engine. It is responsible for compiling `.pug` template files with the provided context.

### Structure

- **Module:**
  ```typescript
  @Module({
    providers: [
      {
        provide: EMAIL_TEMPLATE_SERVICE,
        useClass: PugCompilerService,
      },
      {
        provide: EmailTemplateService,
        useExisting: EMAIL_TEMPLATE_SERVICE,
      },
    ],
    exports: [EMAIL_TEMPLATE_SERVICE, EmailTemplateService],
  })
  export class PugCompilerModule {}
  ```

- **Service:**
  ```typescript
  @Injectable()
  export class PugCompilerService implements EmailTemplateService {
    async compile(templatePath: string, context: any): Promise<string> {
      // Compiles the .pug file at the given path with the provided context
    }
  }
  ```

### Usage

To use the pug-compiler in your email system, register it as the template service in your email module setup:

```typescript
@Module({
  imports: [
    EmailAbstractModule.forRoot({
      adapter: SendgridAdapterModule.register({
        sendgridApiKey: process.env.SENDGRID_API_KEY,
        emailFrom: 'noreply@example.com',
      }),
      templateService: PugCompilerModule,
    }),
  ],
})
export class AppModule {}
```

When you call `emailService.renderTemplate(...)`, the system will use the `PugCompilerService` to render the specified `.pug` template with the given parameters.