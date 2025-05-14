import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const createAdmin = catchAsync(async (req, res) => {
  const result = await userServices.createAdmin(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
};
