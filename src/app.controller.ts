import { Controller, Delete, Res, HttpCode, Header } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Delete()
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  remove(@Res({ passthrough: true }) res: Response): string {
    return res.statusCode.toString();
  }
}
