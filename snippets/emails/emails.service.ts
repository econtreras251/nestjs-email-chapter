import { HttpService } from "@nestjs/axios";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { HttpStatusCode } from "axios";
import type { HttpResponse } from "@BannedCompany/core-api/src/core/HttpResponses";
import type { NotificationBase } from "@BannedCompany/core-api/src/models/NotificationBase";
import type { EmailTemplateResponseViewModel } from "@BannedCompany/core-api/src/viewModels/EmailTemplateResponseViewModel";
import { coreApiConfig } from "../config/core-api.config";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class EmailsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
    @Inject(coreApiConfig.KEY)
    private readonly config: ConfigType<typeof coreApiConfig>
  ) {}

  async sendEmail(
    notification: NotificationBase
  ): Promise<EmailTemplateResponseViewModel> {
    const token = await this.authService.getServiceToken();

    const observable$ = this.httpService.post<
      HttpResponse<EmailTemplateResponseViewModel>
    >(`${this.config.url}/Emails/SendTemplate`, notification, {
      headers: {
        Accept: "application/json",
        Authorization: token,
        ["x-api-key"]: this.config.apiKey
      }
    });

    const response = await lastValueFrom(observable$);

    if (response.status !== HttpStatusCode.Ok) {
      throw new HttpException(response.data, response.status);
    }

    return response.data.data;
  }
}
