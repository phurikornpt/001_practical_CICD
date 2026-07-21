import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { startMetricsServer } from './metrics/metrics.server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Practical CI/CD API')
    .setDescription('Mock APIs (metrics scraped privately on :9090)')
    .setVersion('1.0')
    .addTag('users')
    .addTag('products')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  startMetricsServer(); // sidecar scrape → 127.0.0.1:9090/metrics
}
bootstrap();
