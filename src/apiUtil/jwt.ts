import jwt, { SignOptions } from 'jsonwebtoken';

export const jwtSign = async (
  payload: any,
  SECRET: string,
  options: SignOptions = {}
): Promise<string> => {
  return jwt.sign(payload, SECRET, options);
};

export const jwtVerify = async (token: string, SECRET: string): Promise<any> => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return false;
  }
};
