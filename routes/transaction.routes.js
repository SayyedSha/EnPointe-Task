import { Router } from "express";
import { beforeLogin, verifyJWT } from "../middelwares/auth.middelware.js";
import { credit, getUserTransaction, withdraw } from "../controllers/transaction.controller.js";
const transactionRouter = Router();

transactionRouter.route("/withdraw").post(verifyJWT,withdraw);
transactionRouter.route("/deposit").post(verifyJWT, credit);
transactionRouter.route("/getUserTransaction").get(verifyJWT,getUserTransaction)



export default transactionRouter