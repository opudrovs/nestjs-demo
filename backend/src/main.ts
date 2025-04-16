import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

/**
 * Bootstrap function to initialize the NestJS application.
 * It sets up global exception handling, Swagger documentation,
 * and CORS configuration.
 * Finally, it starts the application on the specified port.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception handler
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger config and setup
  const config = new DocumentBuilder()
    .setTitle('Property Investment API')
    .setDescription('API for placing orders and managing properties')
    .setVersion('1.0')
    .addTag('orders')
    .addTag('properties')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS configuration
  // Allow requests from the frontend application
  // The frontend port is set in the .env file
  // or defaults to 5173 if not specified
  app.enableCors({
    origin: `http://localhost:${process.env.FRONTEND_PORT ?? 5173}`,
  });

  // Start the application on the specified port
  // The port is set in the .env file or defaults to 3000 if not specified
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('NestJS bootstrap failed:', err);
});
