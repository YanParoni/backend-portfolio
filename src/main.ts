import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';

  const httpsOptions = isProduction
    ? {
        key: fs.readFileSync('/home/ubuntu/certificates/privkey.pem'),
        cert: fs.readFileSync(
          '/home/ubuntu/certificates/fullchain.pem',
        ),
      }
    : undefined;

  const app = await NestFactory.create(
    AppModule,
    httpsOptions ? { httpsOptions } : {},
  );

  app.enableCors({
    origin: isProduction
      ? [
          'https://design-template-ivory.vercel.app',
          'https://playboxdapi.online',
        ]
      : 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Playboxdd Documentation')
    .setDescription('Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
