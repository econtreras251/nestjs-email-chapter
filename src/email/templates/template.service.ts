import { Injectable } from "@nestjs/common";
import * as pug from "pug";
import * as path from "path";

@Injectable()
export class TemplateService {
  private readonly templatesDir = path.join(
    process.cwd(),
    "src/email/templates",
  );

  async render(templateName: string, data: any): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${templateName}.pug`);
    const template = pug.compileFile(templatePath);
    return template(data);
  }
}
