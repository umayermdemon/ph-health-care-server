import config from "../../config";
import { jwtHelper } from "../../../helper/jwtHelper";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: "active",
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    userData?.password
  );
  if (!isPasswordMatched) {
    throw new Error("Password doesn't matched");
  }

  const jwtPayload = {
    email: userData?.email,
    role: userData?.role,
  };

  const accessToken = await jwtHelper.generateToken(
    jwtPayload,
    config.jwt_access_token_secret as Secret,
    config.jwt_access_token_expires_in as string
  );
  const refreshToken = await jwtHelper.generateToken(
    jwtPayload,
    config.jwt_refresh_token_secret as Secret,
    config.jwt_refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData?.needPasswordChange,
  };
};
const refreshToken = async (refreshToken: string) => {
  let decodedData;
  try {
    decodedData = jwtHelper.verifyToken(refreshToken, "abcdefghij");
  } catch (error: any) {
    throw new Error(error);
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: "active",
    },
  });

  const jwtPayload = {
    email: userData?.email,
    role: userData?.role,
  };

  const accessToken = await jwtHelper.generateToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData?.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
