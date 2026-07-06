import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['NODE_ENV', 'PORT', 'DATABASE_URL'];

requiredEnv.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
};
