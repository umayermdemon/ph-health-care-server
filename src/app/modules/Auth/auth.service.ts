import config from "../../config";
import { jwtHelper } from "../../../helper/jwtHelper";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import status from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: "active",
    },
  });

  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }

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
    decodedData = jwtHelper.verifyToken(
      refreshToken,
      config.jwt_refresh_token_secret as Secret
    );
  } catch (error: any) {
    throw new Error(error);
  }
  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData?.email,
      status: "active",
    },
  });

  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }

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

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
      status: "active",
    },
  });

  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload?.oldPassword,
    userData?.password
  );
  if (!isPasswordMatched) {
    throw new Error("Password doesn't matched");
  }

  const hashedPassword: string = await bcrypt.hash(payload?.newPassword, 12);

  await prisma.user.update({
    where: {
      email: user?.email,
      status: "active",
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Change password successfully",
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
};
