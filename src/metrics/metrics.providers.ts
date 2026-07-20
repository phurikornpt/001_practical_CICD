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
    // ยิ่ง bucket เยอะยิ่งแพงบน GMP (2 + non-zero buckets ต่อ series ต่อ instance) — ตัดให้พอดี
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  }),
];

// ตัวอย่าง business metric ของ exam flow (low cardinality เท่านั้น)
export const examMetricsProviders = [
  makeCounterProvider({
    name: 'exam_enter_classroom_total',
    help: 'EnterClassroom attempts by result',
    labelNames: ['result'], // success | lock_timeout | error — จำนวนค่าจำกัด
  }),
  makeGaugeProvider({
    name: 'exam_active_sessions',
    help: 'Currently active exam sessions',
  }),
];
