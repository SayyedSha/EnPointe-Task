import { Router } from "express";
import { beforeLogin, verifyJWT } from "../middelwares/auth.middelware.js";
import { Kpi } from "../controllers/dashboard.controller.js";


const dashboardRouter = Router();

dashboardRouter.route("/KPI").get(verifyJWT, Kpi);


export default dashboardRouter