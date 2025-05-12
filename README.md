## Architecture Overview

This project follows the [Space Guidelines for NestJS](https://spaceuy.github.io/nest-js-guidelines/) architecture, specifically implementing the Abstract Interface pattern for email providers.

### Email Provider Structure

The email system is designed using the adapter pattern, allowing easy switching between different email providers (like Sendgrid, AWS SES, etc.) without affecting the application's business logic.

#### Key Components

1. **Abstract Interface (`MailingProviderService`)**
   ```typescript
   export abstract class MailingProviderService {
     abstract sendEmail<T extends Template, R>(
       params: SendEmailParams<T>
     ): Promise<R>;
   }
   ```
   This abstract class serves as the contract that all email providers must implement.

2. **Provider Adapters**
   - Located in `src/email/adapters/`
   - Each adapter implements the `MailingProviderService` abstract class
   - Example with Sendgrid:
   ```typescript
   @Injectable()
   export class SendgridAdapter extends MailingProviderService {
     async sendEmail<T extends Template, R>(params: SendEmailParams<T>): Promise<R> {
       // Sendgrid specific implementation
     }
   }
   ```

3. **Module Configuration**
   ```typescript
   @Module({
     providers: [
       {
         provide: MailingProviderService,
         useClass: SendgridAdapter,
       },
     ],
     exports: [MailingProviderService],
   })
   export class EmailModule {}
   ```

### Project Structure

```
src/email/
├── interfaces/
│   └── email.interface.ts
├── adapters/
│   └── sendgrid.adapter.ts
├── email.controller.ts
├── email.module.ts
```

### Usage

To use the email service in your application:

1. Import the EmailModule in your app:
   ```typescript
   @Module({
     imports: [EmailModule],
   })
   export class AppModule {}
   ```

2. Inject the email service using the abstract class:
   ```typescript
   constructor(private readonly mailingService: MailingProviderService) {}
   ```

### Adding New Providers

To add a new email provider:

1. Create a new adapter in `src/email/adapters/`
2. Implement the `MailingProviderService` abstract class
3. Update the module provider configuration

Example:
```typescript
@Injectable()
export class AwsSesAdapter extends MailingProviderService {
  async sendEmail<T extends Template, R>(params: SendEmailParams<T>): Promise<R> {
    // AWS SES specific implementation
  }
}
```

For more detailed information about providers, see [Providers Documentation](docs/providers.MD).
For template management details, see [Template Documentation](docs/template.MD).

### Benefits

- **Loose Coupling**: Business logic is decoupled from specific email provider implementations
- **Easy Provider Switching**: Change providers by updating a single module configuration
- **Consistent Interface**: All providers follow the same contract
- **Testability**: Easy to mock email services for testing