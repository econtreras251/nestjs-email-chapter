import { DynamicModule, ForwardReference, Module, Type } from "@nestjs/common";
import { EMAIL_PROVIDER } from "./email-provider.const";
import { EmailService } from "./email.service";

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
    const { adapter, isGlobal = false } = options;
    return {
      module: EmailAbstractModule,
      global: isGlobal,
      providers: [
        {
          provide: EmailService,
          useFactory: (adapter: AdapterModule) => adapter,
          inject: [EMAIL_PROVIDER],
        },
      ],
      imports: [adapter],
      exports: [EmailService],
    };
  }
}
