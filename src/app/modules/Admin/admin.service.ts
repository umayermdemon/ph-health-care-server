import { Prisma } from "../../../../generated/prisma";
import { paginationHelper } from "../../../helper/pagination-helper";
import prisma from "../../../shared/prisma";

const getAllAdmin = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filteredData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];
  const adminSearchableFields = ["name", "email"];

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
          equals: filteredData[key],
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

export const adminServices = {
  getAllAdmin,
};
