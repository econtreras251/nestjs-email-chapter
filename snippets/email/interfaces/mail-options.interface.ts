import type { Readable } from "stream";
import type { Url } from "url";

export interface EmailAddress {
  name: string;
  address: string;
}

interface AttachmentLike {
  /** String, Buffer or a Stream contents for the attachmentent */
  content?: string | Buffer | Readable;
  /** path to a file or an URL (data uris are allowed as well) if you want to stream the file instead of including it (better for larger attachments) */
  path?: string | Url;
}

interface MailAttachment {
  /** filename to be reported as the name of the attached file, use of unicode is allowed. If you do not want to use a filename, set this value as false, otherwise a filename is generated automatically */
  filename?: string | false;
  /** optional path  */
  path?: string;
}

export interface MailOptions {
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the To: field */
  to?: string | EmailAddress | Array<string | EmailAddress>;
  /** The subject of the e-mail */
  subject?: string;
  /** The plaintext version of the message */
  text?: string | Buffer | Readable | AttachmentLike;
  /** The HTML version of the message */
  html?: string | Buffer | Readable | AttachmentLike;
  /** An object or array of additional header fields */
  attachments?: MailAttachment[];
}
