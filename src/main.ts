import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // retire les props non listées dans le DTO
      forbidNonWhitelisted: true, // erreur si props inconnues
      transform: false, //ne transforme pas utomatiquement les types (string -> number, etc.)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
