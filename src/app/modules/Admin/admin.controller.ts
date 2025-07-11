import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { filterableField } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import status from "http-status";

const getAllAdmin = catchAsync(async (req, res) => {
  const filters = pick(req.query, filterableField);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await adminServices.getAllAdmin(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All admin retrieved successfully",
    data: result,
  });
});
const getByIdFromDb = catchAsync(async (req, res) => {
  const id  = req.params.id;
  const result = await adminServices.getByIdFromDb(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is retrieved successfully",
    data: result,
  });
});
const updateIntoDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.updateIntoDb(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is updated successfully",
    data: result,
  });
});
const deleteFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.deleteFromDb(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  });
});
const softDeleteFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.softDeleteFromDb(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  });
});

export const adminControllers = {
  getAllAdmin,
  getByIdFromDb,
  updateIntoDb,
  deleteFromDb,
  softDeleteFromDb,
};
