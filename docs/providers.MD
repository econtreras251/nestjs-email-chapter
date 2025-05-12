# Email provider comparison

## Objective

As part of the base template project for {GLITCH}, we aim to define a standardized email provider integration. This document outlines a comparison between Twilio SendGrid (our current default) and Amazon SES, with the goal of evaluating the best option based on predefined criteria.

## Evaluation Criteria

We'll assess each provider on the following:

1. **Pricing**
2. **Important Features** (e.g., campaigns, API capabilities, analytics)
3. **Support Quality**
4. **Attachments Handling**
5. **Campaign Capabilities**
6. **Ease of Integration**
7. **Documentation and SDK Availability**


## Provider Overview

| Criteria                | Twilio SendGrid                             | Amazon SES                                |
|------------------------|---------------------------------------------|-------------------------------------------|
| **Pricing**            | Free tier: 100 emails/day for 60 days. After free tier: ~$20/mo for 50K-100K emails. See [pricing](https://sendgrid.com/pricing/) | Free tier: 3,000 messages/month for first 12 months (new customers, any sending method - Email API). After free tier: $0.10/1K messages. See [pricing](https://aws.amazon.com/ses/pricing/) |
| **Features**           | Email API, SMTP relay, marketing campaigns, templates, webhooks, analytics, subusers. See [features](https://sendgrid.com/en-us/pricing#straightforward-integration) | Email API, SMTP relay, DKIM/SPF support, basic analytics. Campaign features not native. See [features](https://aws.amazon.com/ses/details/) |
| **Support**            | Ticket-based for free plans, chat/support with higher tiers. Enterprise SLAs available. See [support](https://support.sendgrid.com/hc/en-us) | Basic support with AWS free tier, premium support via AWS Support Plans. See [support](https://aws.amazon.com/premiumsupport/) |
| **Attachments**        | Supports attachments, limit: 30MB per message (combined). See [docs](https://www.twilio.com/docs/sendgrid/api-reference/mail-send#limitations) | Supports attachments, limit: 40MB per total message. See [docs](https://docs.aws.amazon.com/ses/latest/dg/attachments.html) |
| **Campaigns**          | Built-in support for campaign management, segmentation, and email scheduling. See [campaigns](https://sendgrid.com/en-us/solutions/email-marketing) | No built-in campaign support; must integrate with additional tools or build custom solution (e.g., using Amazon Pinpoint). See [campaigns](https://aws.amazon.com/pinpoint/) |
| **Ease of Integration**| Good SDKs and integration guides across languages. Template management via API. See [integration](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs) | Integration requires more AWS setup (IAM, verified identities), SDKs available, more configuration overhead. See [integration](https://docs.aws.amazon.com/ses/latest/dg/setting-up.html) |
| **Docs & SDKs**        | [SendGrid Docs](https://docs.sendgrid.com/) | [Amazon SES Docs](https://docs.aws.amazon.com/ses/) |


## Summary & Recommendations

Given this template's objective of being a plug-and-play solution that defines structure, the conclusions are:

- **Twilio SendGrid** provides a comprehensive solution with quick setup, extensive features for both transactional and marketing emails, and well-documented integration paths.
- **Amazon SES** offers cost-effective scalability but requires additional development effort and AWS-specific tooling for advanced features.

### Final Notes

- For projects requiring email marketing capabilities (campaigns, segmentation), **SendGrid is the recommended choice** due to its straightforward integration and comprehensive feature set.
- **Amazon SES** is best suited for AWS-centric projects or when cost optimization is the primary concern, though it requires integration with Amazon Pinpoint for campaign management features.
