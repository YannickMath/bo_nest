import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbValidationSchema } from './validation/dbValidation';
import dbConfig from './config/dbConfig';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // rend la config dispo partout
      load: [dbConfig], // charge la config de la BDD
      validationSchema: dbValidationSchema, // schéma de validation avec Joi
      envFilePath: ['.env'], // fichier(s) .env à charger
    }),
    UsersModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // const ssl = config.get<boolean | Record<string, unknown>>(
        //   'database.ssl',
        // );
        return {
          type: 'postgres',
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
          synchronize: config.get<boolean>('database.synchronize'), // sync en dev seulement
          // ssl,
          autoLoadEntities: true, // évite de lister chaque entité
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
