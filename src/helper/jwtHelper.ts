import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const generateToken = async (
  payload: any,
  secret: Secret,
  expiresIn: string | number
) => {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = {
  generateToken,
  verifyToken,
};
