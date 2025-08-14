import type { Request, Response } from "express";
import multer from 'multer'
import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";
import * as fs from 'fs';
import { MAX_FILE_BYTES, UPLOAD_DIR } from "../secrets.js";
import {parse} from 'csv-parse'


const storage = multer.diskStorage({
    destination: function(_req, _file, cb) {
        if (!UPLOAD_DIR) throw new Error('UPLOAD_DIR is missing');
        fs.mkdirSync(UPLOAD_DIR!, { recursive: true });
        cb(null, UPLOAD_DIR);
    },
    filename: function(_req, file, cb){
        const stamp = Date.now();
        cb(null, `${stamp}-${file.originalname}`)
    }
})

export const uploadMiddleware = multer({
    storage,
    limits:{fileSize: MAX_FILE_BYTES},
    fileFilter: function(_req, file, cb){
        if(file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')){
            return cb(new Error('Only CSV files are allowed'));
        }
        cb(null,true)
    }
}).single('file')

type Row = {name?:string, email?:string,phone?:string}

export async function handleUpload(req:Request, res:Response) {
    const file = (req as any).file as Express.Multer.File | undefined
    if (!file) return res.status(400).json({ error: 'CSV file is required (field name: file)' });

    const user = (req as any).user as {id:string, role:string}

    const rows: Row[] = await new Promise(function(resolve, reject){
        const results: Row[] = [];
        fs.createReadStream(file.path)
        .pipe(parse({columns:true, trim:true}))
        .on('data', function(row){results.push(row)})
        .on('end',function(){resolve(results)})
        .on('error', function(e){reject(e)})
    })

    const toInsert = rows.map(function(r, idx){
        if(!r.name || !r.email){
            throw Object.assign(new Error(`Row ${idx + 1}: name, email, amount required`), { status: 400 });
        }
        return {
            name: r.name,
            email: r.email,
            phone: r.phone ?? null,
            userId: user.id
        }
    })

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        for (const rec of toInsert) {
            await tx.record.create({ data: rec });
        }
    });
    res.status(201).json({ message: 'Upload processed', rows: toInsert.length, file:file.originalname });
}


