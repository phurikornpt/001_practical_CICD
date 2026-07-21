import {
  makeCounterProvider,
  makeHistogramProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';

export const httpMetricsProviders = [
  makeCounterProvider({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status_code'], // ห้ามมี user/session/attempt id
  }),
  makeHistogramProvider({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    // เริ่มที่ 5ms — ถ้าเริ่มที่ 50ms แล้ว API เร็วกว่านั้น p50/p95/p99 จะติด 50ms หมด
    buckets: [0.05, 0.1, 0.5, 1, 5],
  }),
];

// business metrics ของ order flow (low cardinality เท่านั้น)
export const orderMetricsProviders = [
  makeCounterProvider({
    name: 'orders_created_total',
    help: 'Create order attempts by result',
    labelNames: ['result'], // success | invalid | error
  }),
  makeGaugeProvider({
    name: 'orders_pending',
    help: 'Orders currently in pending status',
  }),
];
