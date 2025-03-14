import { Injectable } from '@nestjs/common';
import { MailingProviderService, SendEmailParams, Template } from '../interfaces/email.interface';

@Injectable()
export class SendgridAdapter extends MailingProviderService {
  async sendEmail<T extends Template, R>(
    params: SendEmailParams<T>
  ): Promise<R> {
    // Implement Sendgrid specific logic here
    const { template, to, from, subject } = params;
    
    // TODO: Add your Sendgrid implementation
    console.log('Sending email via Sendgrid:', { template, to, from, subject });
    
    return {} as R;
  }
} 