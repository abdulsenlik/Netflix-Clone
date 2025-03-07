// import {PrismaClient} from '@prisma/client';

// const client = global.prismadb || new PrismaClient();
// if(process.env.NODE_ENV === 'production') global.prismadb = client;

// export default client;

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prismadb?: PrismaClient };

const prismadb = globalForPrisma.prismadb ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismadb = prismadb;

export default prismadb;