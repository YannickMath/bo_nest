// src/csrf/csrf.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import { CsrfController } from './csrf.controller';

const isProd = process.env.NODE_ENV === 'production';

export const {
  doubleCsrfProtection,
  generateCsrfToken, // signature: (req: Request, res: Response) => string
  // invalidCsrfTokenError, validateRequest // dispo si besoin
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'dev-secret',
  // optionnel; enlève si tu n'utilises pas de session
  getSessionIdentifier: (req: Request) =>
    (req.ip as string) || (req.headers['x-forwarded-for'] as string) || '',
  cookieName: 'XSRF-TOKEN',
  cookieOptions: {
    sameSite: 'lax',
    secure: false, // true en prod (HTTPS)
    httpOnly: false, // lisible par le front (double-submit cookie)
    path: '/',
  },
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  // ⚠️ le nom d’option attendu par la lib est souvent `getTokenFromRequest`
  // si ta version s'appelle `getCsrfTokenFromRequest`, garde ce nom.
  getCsrfTokenFromRequest: (req: Request & { body?: { _csrf?: string } }) =>
    (req.headers['x-csrf-token'] as string) ||
    ((req.body && req.body._csrf) as string) ||
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
