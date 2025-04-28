import express, { Application, Request, Response } from "express";

import cors from "cors";
import { userRoutes } from "./app/modules/User/user.routes";
import { adminRoutes } from "./app/modules/Admin/admin.routes";

const app: Application = express();

app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server.....",
  });
});

app.use("/api/v1", userRoutes);

app.use("/api/v1/getAdmin", adminRoutes);

export default app;
