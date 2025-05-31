// import {PrismaClient} from '@prisma/client';

// const client = global.prismadb || new PrismaClient();
// if(process.env.NODE_ENV === 'production') global.prismadb = client;

// export default client;

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prismadb?: PrismaClient };

export const prismadb =
  globalForPrisma.prismadb ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismadb = prismadb;

export default prismadb;