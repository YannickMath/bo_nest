import { Controller, Get, Req, Res } from '@nestjs/common';
import { generateCsrfToken } from './csrf.module';

@Controller('csrf')
export class CsrfController {
  @Get('csrfToken')
  getCsrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const csrfToken = generateCsrfToken(req, res);
    return { csrfToken };
  }
}
