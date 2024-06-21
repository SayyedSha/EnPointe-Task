import { Router } from "express";
import { beforeLogin, verifyJWT } from "../middelwares/auth.middelware.js";
import { accountDetail, createBankAccount } from "../controllers/account.controller.js";
const accountsRouter = Router();

accountsRouter.route("/createAccount").post(createBankAccount);
accountsRouter.route("/getaccountDetail").get(verifyJWT,accountDetail);

export default accountsRouter