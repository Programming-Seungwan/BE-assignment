import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('seungwan ecommerce backend API')
    .setDescription('seungwan ecommerce backend의 Swagger API 문서입니다.')
    .setVersion('1.0')
    .addTag('seungwan ecommerce')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // http://localhost:3000/api-docs 로 접속

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
