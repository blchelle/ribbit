import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';

export interface Context {
	prisma: PrismaClient;
	redis: Redis;
	req: Request;
	res: Response;
}
