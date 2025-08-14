import type { Request, Response } from "express";
import {prisma} from '../db.js'
import { stringify } from "csv-stringify";

export async function listRecords(req:Request, res:Response){
    const user = (req as any).user as {id:string, role:'USER' | 'ADMIN'}
    const {page = '1', limit = '20', name, email} = req.query as Record<string,string>
    const take = Math.min(Math.max(Number(limit),1),100)
    const skip = (Math.max(Number(page),1)-1)* take

    const where = {
        ...(name ? {name:{contains:name, mode: 'insensitive' as const}} : {}),
        ...(email ? {email:{contains:email, mode: 'insensitive' as const}} : {}),
        ...(user.role === 'ADMIN' ? {} : {userId:user.id})
    }

    const [items, total]=await Promise.all([
        prisma.record.findMany({where, orderBy:{uploadedAt:'desc'},skip,take}),
        prisma.record.count({where})
    ])
    res.json({ page: Number(page), limit: take, total, items });
}


export async function downloadRecords(req:Request, res:Response){
    const user = (req as any).user as { id: string; role: 'USER'|'ADMIN' };
    const {name, email} = req.query as Record<string, string>;

    const where = {
        ...(name ? {name:{contains:name, mode: 'insensitive' as const}} : {}),
        ...(email ? {email:{contains:email, mode: 'insensitive' as const}} : {}),
        ...(user.role === 'ADMIN' ? {} : {userId:user.id})
    }

    const rows = await prisma.record.findMany({where,  orderBy: { uploadedAt: 'desc' }})

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="records.csv"');

    const stringifier = stringify({header:true,columns:['name','email','phone','uploadedAt','userId']})
    for(const r of rows){
        stringifier.write([r.name, r.email, r.phone ?? '', r.uploadedAt.toISOString(), r.userId])
    }
    stringifier.end()
    stringifier.pipe(res)
}