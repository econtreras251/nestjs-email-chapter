import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class EmailTemplateService {
  abstract compile(templatePath: string, context: any): string;
}
