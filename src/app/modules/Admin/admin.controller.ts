import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { filterableField } from "./admin.constant";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, filterableField);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await adminServices.getAllAdmin(filters, options);
    res.status(200).json({
      success: true,
      message: "All admin retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: err?.message || "Something went wrong",
    });
  }
};
const getByIdFromDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await adminServices.getByIdFromDb(id);
    res.status(200).json({
      success: true,
      message: "Admin is retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: err?.message || "Something went wrong",
    });
  }
};
const updateIntoDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await adminServices.updateIntoDb(id, req.body);
    res.status(200).json({
      success: true,
      message: "Admin is updated successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: err?.message || "Something went wrong",
    });
  }
};

export const adminControllers = {
  getAllAdmin,
  getByIdFromDb,
  updateIntoDb,
};
