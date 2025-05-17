import { TRequestUser } from "../../types";

declare global {
  namespace Express {
    interface Request {
      user: TRequestUser;
    }
  }
}
