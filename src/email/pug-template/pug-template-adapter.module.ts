import { DynamicModule, Module, ModuleMetadata } from "@nestjs/common";
import { EMAIL_TEMPLATE_SERVICE } from "../abstract/template-provider.const";
import { PugTemplateAdapter } from "./pug-template-adapter";

// TODO: Investigate if this module is needed and how we are going to organize
// on planetary

@Module({})
export class PugTemplateAdapterModule {
  static register(): DynamicModule {
    return {
      module: PugTemplateAdapterModule,
      providers: [
        {
          provide: EMAIL_TEMPLATE_SERVICE,
          useClass: PugTemplateAdapter,
        },
      ],
      exports: [EMAIL_TEMPLATE_SERVICE],
    };
  }

  static registerAsync(options: {
    imports?: ModuleMetadata["imports"];
  }): DynamicModule {
    return {
      module: PugTemplateAdapterModule,
      imports: options.imports || [],
      providers: [
        {
          provide: EMAIL_TEMPLATE_SERVICE,
          useClass: PugTemplateAdapter,
        },
      ],
      exports: [EMAIL_TEMPLATE_SERVICE],
    };
  }
}
