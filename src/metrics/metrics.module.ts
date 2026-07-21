import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { collectDefaultMetrics, register } from 'prom-client';
import {
  HTTP_REQUEST_DURATION_SECONDS,
  HTTP_REQUESTS_TOTAL,
  ORDERS_CREATED_TOTAL,
  ORDERS_PENDING,
} from './metrics.tokens';
import { MetricsInterceptor } from './metrics.interceptor';
import {
  getOrCreateCounter,
  getOrCreateGauge,
  getOrCreateHistogram,
} from './prom.util';

register.setDefaultLabels({ service: 'example-service-api-v2' });
collectDefaultMetrics({ register }); // process metrics → global registry

const httpMetricsProviders = [
  {
    provide: HTTP_REQUESTS_TOTAL,
    useFactory: () =>
      getOrCreateCounter({
        name: HTTP_REQUESTS_TOTAL,
        help: 'Total HTTP requests',
        labelNames: ['method', 'route', 'status_code'],
        registers: [register],
      }),
  },
  {
    provide: HTTP_REQUEST_DURATION_SECONDS,
    useFactory: () =>
      getOrCreateHistogram({
        name: HTTP_REQUEST_DURATION_SECONDS,
        help: 'HTTP request duration in seconds',
        labelNames: ['method', 'route', 'status_code'],
        buckets: [0.05, 0.1, 0.5, 1, 5],
        registers: [register],
      }),
  },
];

const orderMetricsProviders = [
  {
    provide: ORDERS_CREATED_TOTAL,
    useFactory: () =>
      getOrCreateCounter({
        name: ORDERS_CREATED_TOTAL,
        help: 'Create order attempts by result',
        labelNames: ['result'],
        registers: [register],
      }),
  },
  {
    provide: ORDERS_PENDING,
    useFactory: () =>
      getOrCreateGauge({
        name: ORDERS_PENDING,
        help: 'Orders currently in pending status',
        registers: [register],
      }),
  },
];

@Module({
  providers: [
    ...httpMetricsProviders,
    ...orderMetricsProviders,
    { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
  ],
  exports: orderMetricsProviders,
})
export class MetricsModule {}
