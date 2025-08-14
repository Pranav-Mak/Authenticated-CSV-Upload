import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../src/secrets.js";

const prisma = new PrismaClient()

async function main() {
    const email = ADMIN_EMAIL
    const password = ADMIN_PASSWORD
    if (!email || !password) {
        throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env");
    }
    const existing = await prisma.user.findUnique({where:{email}})
    if(!existing){
        const hash = await bcrypt.hash(password,10)
        await prisma.user.create({
            data:{name:'Admin',email,password:hash,role:'ADMIN'}
        })
        console.log('Seeded admin:', email);
    }else {
        console.log('Admin already exists.');
      }
}

main()
.catch((err) => {console.error("Seeding failed:", err);})
.finally(function(){prisma.$disconnect()})