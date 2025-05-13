import * as pug from "pug";
import { EmailTemplateService } from "../abstract/templates.abstract";
import { Injectable } from "@nestjs/common";
import { TEMPLATE_PATHS } from "../../templates/index";

@Injectable()
export class PugTemplateAdapter extends EmailTemplateService {
  constructor() {
    super();
  }

  compile(templatePath: string, context: pug.LocalsObject): string {
    const fullPath =
      TEMPLATE_PATHS[templatePath as keyof typeof TEMPLATE_PATHS];
    const compiledFunction = pug.compileFile(fullPath);
    return compiledFunction(context);
  }
}
