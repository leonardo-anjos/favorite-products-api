import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { logger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // disable Nest default logger
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  logger.info('Starting application...');
  await app.listen(process.env.PORT ?? 3000);
  logger.info(
    `Application running at http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap();
