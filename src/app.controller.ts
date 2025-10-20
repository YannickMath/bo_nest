import {
  Controller,
  Delete,
  // Get,
  Post,
  Res,
  HttpCode,
  Header,
  // Param,
  Body,
} from '@nestjs/common';
import type { Response } from 'express';
// import { CreateCatDto } from './create-cat.dto';
import { CreateUserDto } from './Users/DTO/input/create-user.dto';

@Controller()
export class AppController {
  // @Post()
  // create(): string {
  //   return 'This action adds a new cat';
  // }

  getHello(): string {
    return 'Hello World!';
  }

  // @Get()
  // @Redirect('https://docs.nestjs.com', 302)
  // getDocs(@Query('version') version) {
  //   if (version && version === '5') {
  //     return { url: 'https://docs.nestjs.com/v5/' };
  //   }
  // }
  // @Get(':id')
  // findOne(@Param('id') id: string): string {
  //   console.log(id);
  //   return `This action returns a #${id} cat`;
  // }

  @Post()
  // async create(@Body() createCatDto: CreateCatDto): Promise<string> {
  //   console.log(createCatDto);
  //   await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate a delay of 5 seconds
  //   return 'This action adds a new cat';
  // }
  async create(@Body() createCatDto: CreateUserDto): Promise<string> {
    console.log(createCatDto);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate a delay of 5 seconds
    return 'This action adds a new user';
  }

  @Delete()
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  remove(@Res({ passthrough: true }) res: Response): string {
    console.log('Response Status Code:', res.statusCode);
    return res.statusCode.toString();
  }
}
