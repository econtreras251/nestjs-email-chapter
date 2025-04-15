import {
  DynamicModule,
  ForwardReference,
  Module,
  Provider,
  Type,
} from "@nestjs/common";
import { EMAIL_PROVIDER } from "./email-provider.const";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";
import { EmailSender } from "./email.sender";

type AdapterModule =
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference;

interface EmailModuleOptions {
  adapter: AdapterModule;
  useDefaultController?: boolean;
  isGlobal?: boolean;
  customController?: Type<any>[];
}

@Module({})
export class EmailAbstractModule {
  static forRoot(options: EmailModuleOptions): DynamicModule {
    const {
      adapter,
      isGlobal = false,
      useDefaultController = true,
      customController,
    } = options;

    const controllers =
      customController || (useDefaultController ? [EmailController] : []);

    const providers: Provider[] = useDefaultController ? [EmailSender] : [];

    return {
      module: EmailAbstractModule,
      global: isGlobal,
      providers: [
        {
          provide: EmailService,
          useFactory: (adapter: AdapterModule) => adapter,
          inject: [EMAIL_PROVIDER],
        },
        ...providers,
      ],
      imports: [adapter],
      exports: [EmailService],
      controllers,
    };
  }
}
