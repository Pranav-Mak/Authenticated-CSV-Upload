import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { handleUpload, uploadMiddleware } from "./uploads.controller.js";


export const uploadRouter = Router()

uploadRouter.post('/', requireAuth, function(req,res,next){
    uploadMiddleware(req,res,(err)=> err? next(err): next())
},handleUpload)