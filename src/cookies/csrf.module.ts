import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import type { Request } from 'express';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';

// const isProd = process.env.NODE_ENV === 'production';

export const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'dev-secret',
  // optionnel; enlève si tu n'utilises pas de session
  getSessionIdentifier: (req: Request) =>
    (req.ip as string) || (req.headers['x-forwarded-for'] as string) || '',
  // options pour le cookie CSRF
  cookieName: 'XSRF-TOKEN',
  cookieOptions: {
    sameSite: 'lax',
    secure: false, // true en prod (HTTPS)
    httpOnly: false, // lisible par le front (double-submit cookie)
    path: '/',
  },
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],

  getCsrfTokenFromRequest: (req: Request & { body?: { _csrf?: string } }) =>
    (req.headers['x-csrf-token'] as string) ||
    ((req.body as { _csrf?: string } | undefined)?._csrf as string) ||
    '',
});

@Module({})
export class CsrfModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // l’ordre compte: cookieParser d’abord
      .apply(cookieParser(), doubleCsrfProtection)
      .forRoutes('*');
  }
}
