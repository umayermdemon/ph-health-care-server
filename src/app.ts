import express, { Application, NextFunction, Request, Response } from "express";

import cors from "cors";
import router from "./app/router/routes";
import globalErrorHandler from "./app/middleWares/globalErrorHandler";
import status from "http-status";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server.....",
  });
});

app.use("/api/v1", router);

// error handler
app.use(globalErrorHandler);

// not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "Api not found!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
