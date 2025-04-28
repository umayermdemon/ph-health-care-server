import { UserRole } from "../../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createAdmin = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tc) => {
    await tc.user.create({
      data: userData,
    });

    const createAdmin = await tc.admin.create({
      data: data.admin,
    });

    return createAdmin;
  });

  return result;
};

export const userServices = {
  createAdmin,
};
