import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export function csrfSessionCookie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.cookies?.CSRF_SESSION_ID) {
    res.cookie('CSRF_SESSION_ID', crypto.randomBytes(32).toString('hex'), {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });
  }
  next();
}
