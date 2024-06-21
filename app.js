import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config({
    path: "./.env",
  });

const app = express();

import userRouter from "./routes/user.routes.js"
import accountsRouter from "./routes/accountDetails.routes.js"
import transactionRouter from "./routes/transaction.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js";


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/user",userRouter);
app.use("/api/account",accountsRouter);
app.use("/api/transaction",transactionRouter);
app.use("/api/dashboard",dashboardRouter);


export {app};