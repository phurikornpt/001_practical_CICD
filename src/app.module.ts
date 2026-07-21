import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { httpMetricsProviders } from './metrics/metrics.providers';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true }, // node/process metrics (heap, event loop) — cardinality ต่ำ ปลอดภัย
      defaultLabels: { service: 'example-service-api-v2' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...httpMetricsProviders,
    { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
  ],
})
export class AppModule {}
