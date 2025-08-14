import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets.js";


export interface JwtUser {
    id: string;
    role: 'USER' | 'ADMIN';
}

export function requireAuth(req: Request, res: Response, next: NextFunction){
    let token = undefined;
    const header = req.header('Authorization')
    if(header?.startsWith('Bearer')){
        token = header.slice(7);
    }
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }
    if (!token) {
    return res.status(401).json({ error: 'Missing or invalid token' });
    }  
    try{
        const payload = jwt.verify(token, JWT_SECRET) as JwtUser
        (req as any).user = payload
        next()
    }catch{
        return res.status(401).json({ error: 'Invalid or expired token'});
    }
}

export function requireRole(role:"ADMIN"){
    return function(req: Request, res: Response, next: NextFunction){
        const user = (req as any).user as JwtUser | undefined
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        if (user.role !== role) return res.status(403).json({ error: 'Forbidden' });
        next()
    }
}