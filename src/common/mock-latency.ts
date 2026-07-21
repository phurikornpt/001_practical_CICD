import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Observable, from, switchMap } from 'rxjs';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Random delay in [minMs, maxMs], with ~5% long-tail (up to ~3x max) so p99 moves. */
function mockDelayMs(minMs: number, maxMs: number): number {
  if (Math.random() < 0.05) {
    return Math.floor(maxMs + Math.random() * maxMs * 2);
  }
  return Math.floor(minMs + Math.random() * (maxMs - minMs + 1));
}

/** Per-controller mock latency — ranges differ so services look different on dashboards. */
export function MockLatency(
  minMs: number,
  maxMs: number,
): Type<NestInterceptor> {
  @Injectable()
  class MockLatencyInterceptor implements NestInterceptor {
    intercept(
      _context: ExecutionContext,
      next: CallHandler,
    ): Observable<unknown> {
      const ms = mockDelayMs(minMs, maxMs);
      return from(sleep(ms)).pipe(switchMap(() => next.handle()));
    }
  }
  return MockLatencyInterceptor;
}
