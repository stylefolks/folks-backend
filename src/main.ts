import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle('Folks API')
    .setDescription('Folks project API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000); // TODO 나중에 4000을 기본으로 가져가자.
}
bootstrap();
