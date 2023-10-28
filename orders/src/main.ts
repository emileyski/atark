import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

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

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT);

  Logger.log(`😎 Orders service is running on port ${PORT}`, `bootstrap`);

  const mqApp = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'main_queue',
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });

  await mqApp.listen();

  Logger.log(`😎 Orders microservice is listening`, `bootstrap`);
}
bootstrap();
