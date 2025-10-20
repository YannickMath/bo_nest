import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV !== 'production', // true en dev, false en prod
  //   ssl:
  //     process.env.NODE_ENV === 'production'
  //       ? { rejectUnauthorized: false }
  //       : false,
}));
