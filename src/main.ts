import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { logger } from './logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // disable Nest default logger
  });

  const config = new DocumentBuilder()
    .setTitle('favorite-products-api')
    .setDescription('api doc')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  logger.info('starting application...');

  await app.listen(process.env.PORT ?? 3000);

  logger.info(
    `application running at http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap();
