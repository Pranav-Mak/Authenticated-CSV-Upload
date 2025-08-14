import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config({path:'.env'})

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET missing');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing');

export const PORT = process.env.PORT

export const JWT_SECRET: string = process.env.JWT_SECRET;

export const NODE_ENV = process.env.NODE_ENV

export const DATABASE_URL = process.env.DATABASE_URL!

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] | undefined;

export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10)

export const UPLOAD_DIR = process.env.UPLOAD_DIR

export const MAX_FILE_BYTES = Number(process.env.MAX_FILE_BYTES ?? 10_485_760);

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
