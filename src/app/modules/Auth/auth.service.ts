import { jwtHelper } from "../../../helper/jwtHelper";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
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
    "abcdefgh",
    "5m"
  );
  const refreshToken = await jwtHelper.generateToken(
    jwtPayload,
    "abcdefghij",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData?.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
