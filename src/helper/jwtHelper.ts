import jwt from "jsonwebtoken";

const generateToken = async (
  payload: any,
  secret: string,
  expiresIn: string
) => {
  const result = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return result;
};

export const jwtHelper = {
  generateToken,
};
