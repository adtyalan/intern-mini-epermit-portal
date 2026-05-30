import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.permit.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      username: "admin",
      password: "admin123",
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      username: "user1",
      password: "user123",
      role: "USER",
    },
  });

  await prisma.user.create({
    data: {
      username: "user2",
      password: "user123",
      role: "USER",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
