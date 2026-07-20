import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { Request, Response } from 'express';

/** Express types `req.route` as any — narrow before using as a Prometheus label. */
function resolveRouteTemplate(req: Request): string {
  const route: unknown = Reflect.get(req, 'route');
  if (typeof route !== 'object' || route === null) {
    return 'unknown';
  }
  const path: unknown = Reflect.get(route, 'path');
  return typeof path === 'string' ? path : 'unknown';
}

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly requests: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly duration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();

    // ข้าม /metrics เอง — ไม่นับ scrape เป็น traffic
    if (req.path === '/metrics') {
      return next.handle();
    }

    const start = process.hrtime.bigint();
    const method = req.method;
    // ใช้ route template ไม่ใช่ req.url — กัน cardinality explosion บน GMP
    const route = resolveRouteTemplate(req); // เช่น /users/:id ไม่ใช่ /users/abc-123

    const record = (err?: unknown) => {
      const res = context.switchToHttp().getResponse<Response>();
      const status_code = String(
        err instanceof HttpException
          ? err.getStatus()
          : (res.statusCode ?? 500),
      );
      const labels: Record<string, string> = { method, route, status_code };
      const seconds = Number(process.hrtime.bigint() - start) / 1e9;
      this.requests.inc(labels);
      this.duration.observe(labels, seconds);
    };

    return next.handle().pipe(
      tap({
        next: () => record(),
        error: (err: unknown) => record(err),
      }),
    );
  }
}
