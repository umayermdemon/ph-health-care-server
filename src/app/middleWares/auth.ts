import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../../helper/jwtHelper";
import config from "../config";
import { Secret } from "jsonwebtoken";
import AppError from "../errors/AppError";
import status from "http-status";
import { TRequestUser } from "../../types";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(status.UNAUTHORIZED, "You are not authorized!");
      }

      const decodedData = jwtHelper.verifyToken(
        token,
        config.jwt_access_token_secret as Secret
      );

      if (roles.length && !roles.includes(decodedData?.role)) {
        throw new AppError(status.FORBIDDEN, "Forbidden!");
      }
      req.user = decodedData as TRequestUser;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
