import dotenv from 'dotenv';

dotenv.config();

export const __PROD__ = process.env.NODE_ENV === 'production';
export const __PORT__ = process.env.PORT ?? 4000;
