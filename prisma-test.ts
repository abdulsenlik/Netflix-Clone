import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst();
    console.log("✅ User found:", user);
  } catch (err) {
    console.error("❌ Prisma query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
