import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { downloadRecords, listRecords } from "./records.controller.js";


export const recordRouter = Router()

recordRouter.get('/', requireAuth, listRecords)
recordRouter.get('/download', requireAuth, downloadRecords)