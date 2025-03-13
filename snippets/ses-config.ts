// import { registerAs } from "@nestjs/config";
// import { validate } from "class-validator";
// import { ParamStoreProvider } from "./param-store.provider";
// import { SesConfig } from "./validation/ses-config";

// export const sesConfig = registerAs("ses", async () => {
//   const config = await ParamStoreProvider.getInstance();
//   const value = SesConfig.fromPlain({
//     from: config.getValue("SES_EMAIL_FROM"),
//     hostName: config.getValue("HOSTNAME"),
//     forceEmailSanitize: config.getValue("FORCE_EMAIL_SANITIZE"),
//     forceEmailSanitizePattern: config.getValue("FORCE_EMAIL_SANITIZE_PATTERN")
//   });
//   await validate(value);
//   return value;
// });
