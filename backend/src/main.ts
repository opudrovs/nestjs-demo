import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception handler
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Property Investment API')
    .setDescription('API for placing orders and managing properties')
    .setVersion('1.0')
    .addTag('orders')
    .addTag('properties')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('FRONTEND_PORT:' + process.env.FRONTEND_PORT);

  app.enableCors({
    origin: `http://localhost:${process.env.FRONTEND_PORT ?? 5173}`,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('NestJS bootstrap failed:', err);
});
