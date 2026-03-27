/*
  Author: André Kreienbring  
  Declares types used for digest authentication
*/

type AuthMessage = {
  auth_type: string;
  realm: string;
  algorithm: string;
  nc: number;
};

export type AuthError = {
  code: number;
  message: AuthMessage;
  nonce: string;
};

export type AuthParams = {
  username?: string;
  realm: string;
  nonce: string;
  cnonce?: string;
  nc: number;
  algorithm: string;
  response?: string;
};
