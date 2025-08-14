import type { Request, Response, NextFunction } from "express";
import {prisma} from '../db.js'
import { BCRYPT_ROUNDS, JWT_EXPIRES_IN, JWT_SECRET } from "../secrets.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function register(req:Request, res:Response){
    const {email, name, password} = req.body ?? {}
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email, password required' });
    }
    const existing = prisma.user.findUnique({where:{email}})
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const user = await prisma.user.create({
        data:{name, email, password: hash }
    })
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function login(req:Request, res:Response){
    const {email, password} = req.body ?? {}
    if (!email || !password) {
        return res.status(400).json({ error: 'email, password required' });
    }
    const user = await prisma.user.findUnique({where:{email}})
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        JWT_EXPIRES_IN ? { expiresIn: JWT_EXPIRES_IN } : undefined
    );
}