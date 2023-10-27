import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api`);

  const options = new DocumentBuilder()
    .setTitle('Orders Service')
    .setDescription('Orders Service API')
    .setVersion('1.0')
    .addTag('orders')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/orders/docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
