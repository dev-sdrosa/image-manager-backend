import { IEmailPayload } from '../email/email-token';
import { ITokenBase } from './token-base.interface';

export interface IRefreshPayload extends IEmailPayload {
  tokenId: string;
}

export interface IRefreshToken extends IRefreshPayload, ITokenBase {}