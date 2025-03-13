// import { registerAs } from "@nestjs/config";
// import { validate } from "class-validator";
// import { ParamStoreProvider } from "./param-store.provider";
// import { EmailConfig } from "./validation/email-config.class";

// export const emailConfig = registerAs("email", async () => {
//   const config = await ParamStoreProvider.getInstance();
//   const value = EmailConfig.fromPlain({
//     replyAddressName: config.getValue("REPLY_ADDRESS_NAME"),
//     replyAddressDomain: config.getValue("REPLY_ADDRESS_DOMAIN"),
//     supportCoreEmail: config.getValue("SUPPORT_CORE_EMAIL")
//   });
//   await validate(value);
//   return value;
// });
