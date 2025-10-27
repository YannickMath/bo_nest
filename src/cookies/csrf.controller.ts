// csrf.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { generateCsrfToken } from './csrf.module';

@Controller('csrf')
export class CsrfController {
  @Get('csrfToken')
  getCsrfToken(@Res({ passthrough: true }) res, @Req() req) {
    const csrfToken = generateCsrfToken(req, res) as string;
    return { csrfToken };
  }
}
