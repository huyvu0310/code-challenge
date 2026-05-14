import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validate all incoming DTOs and strip unknown properties.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // OpenAPI / Swagger UI at /docs (JSON at /docs-json).
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('CRUD service for managing tasks (Problem 5).')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Tasks API listening on http://localhost:${port}`);
  console.log(`Swagger UI:        http://localhost:${port}/docs`);
}

bootstrap();
