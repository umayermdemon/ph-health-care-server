import { Admin, Prisma, UserStatus } from "../../../../generated/prisma";
import { paginationHelper } from "../../../helper/pagination-helper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/IPagination";
import { adminSearchableFields } from "./admin.constant";
import { IAdminParams } from "./admin.interface";

const getAllAdmin = async (
  params: IAdminParams,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filteredData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const filteredArray = Object.keys(filteredData);
  if (filteredArray.length > 0) {
    andConditions.push({
      AND: filteredArray.map((key) => ({
        [key]: {
          equals: (filteredData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDb = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDb = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      // isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};
const deleteFromDb = async (id: string): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (tc) => {
    const deleteAdminData = await tc.admin.delete({
      where: {
        id,
      },
    });

    await tc.user.delete({
      where: {
        email: deleteAdminData.email,
      },
    });
    return deleteAdminData;
  });
  return result;
};
const softDeleteFromDb = async (id: string): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tc) => {
    const deleteAdminData = await tc.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await tc.user.update({
      where: {
        email: deleteAdminData.email,
      },
      data: {
        status: UserStatus.deleted,
      },
    });
    return deleteAdminData;
  });
  return result;
};

export const adminServices = {
  getAllAdmin,
  getByIdFromDb,
  updateIntoDb,
  deleteFromDb,
  softDeleteFromDb,
};
