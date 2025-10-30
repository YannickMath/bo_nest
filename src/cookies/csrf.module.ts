import { Module } from '@nestjs/common';
import type { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

export const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'dev-secret',

  getSessionIdentifier: (req: Request) => {
    const cookies = (req.cookies ?? {}) as Record<string, unknown>;
    const sessionId = cookies['CSRF_SESSION_ID'];
    return typeof sessionId === 'string' ? sessionId : '';
  },

  // Cookie lisible par le front pour le double-submit
  cookieName: 'XSRF-TOKEN',
  cookieOptions: {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // lisible par le front
    path: '/',
  },

  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  skipCsrfProtection: (req) => req.originalUrl.includes('/auth/login'),

  getCsrfTokenFromRequest: (req: Request & { body?: { _csrf?: string } }) =>
    (req.headers['x-csrf-token'] as string) ||
    ((req.body as { _csrf?: string } | undefined)?._csrf as string) ||
    '',
});

@Module({})
export class CsrfModule {}
