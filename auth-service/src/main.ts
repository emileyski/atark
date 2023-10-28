import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Auth Service API')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/auth/docs', app, document);

  await app.listen(3000);
  Logger.log(`😎 Auth service is running on port ${3000}`, `bootstrap`);
}
bootstrap();
