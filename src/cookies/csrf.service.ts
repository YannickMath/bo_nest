import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { generateCsrfToken } from 'src/common/utils/csrf.util';

@Injectable()
export class CsrfService {
  generateCsrfToken(req: Request, res: Response) {
    res.clearCookie('XSRF-TOKEN');
    return generateCsrfToken(req, res);
  }
}
