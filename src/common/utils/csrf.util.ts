import type { Request, Response } from 'express';
import { randomBytes } from 'crypto';

export function generateCsrfToken(req: Request, res: Response): string {
  const token = randomBytes(32).toString('hex');

  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // lisible par JS si tu veux l’envoyer dans un header
    sameSite: 'lax',
    secure: true, // true en prod https
    path: '/',
  });

  // Optionnel: aussi en session côté serveur
  // req.session.csrfToken = token;

  return token;
}
