import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import type { Request } from 'express';
import { CsrfService } from './csrf.service';
import { CsrfController } from './csrf.controller';

export const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'dev-secret',

  // On essaie dans l'ordre : header custom, cookie session, puis ip comme fallback.
  getSessionIdentifier: (req: Request & { cookies?: { sessionId?: string } }) =>
    (req.headers['x-session-id'] as string) ||
    (req.cookies?.sessionId as string) ||
    req.ip ||
    '',

  cookieName: 'XSRF-TOKEN',
  cookieOptions: { sameSite: 'lax', secure: false, httpOnly: false, path: '/' },
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],

  skipCsrfProtection: (req) => req.originalUrl.includes('/auth/login'),

  getCsrfTokenFromRequest: (req: Request & { body?: { _csrf?: string } }) =>
    (req.headers['x-csrf-token'] as string) ||
    ((req.body as { _csrf?: string } | undefined)?._csrf as string) ||
    '',
});

@Module({
  providers: [CsrfService],
  controllers: [CsrfController],
  exports: [CsrfService],
})
export class CsrfModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');

    consumer.apply(doubleCsrfProtection).forRoutes('*');
  }
}
