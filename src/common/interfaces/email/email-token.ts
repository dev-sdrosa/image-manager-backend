import { IAccessPayload } from "../token/access-token.interface";
import { ITokenBase } from "../token/token-base.interface";

export interface IEmailPayload extends IAccessPayload {
  version: number;
}

export interface IEmailToken extends IEmailPayload, ITokenBase{}