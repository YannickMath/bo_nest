// src/config/validation.ts
import * as Joi from 'joi';

export const dbValidationSchema = Joi.object({
  //   NODE_ENV: Joi.string()
  //     .valid('development', 'test', 'production')
  //     .default('development'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow('').required(),
  DATABASE_NAME: Joi.string().required(),
});
