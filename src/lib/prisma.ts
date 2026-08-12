import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDbPath = '/tmp/dev.db';
    const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(sourceDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        }
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.error('Error copying SQLite database to /tmp:', e);
    }
  }

  return 'file:./dev.db';
}

const dbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
