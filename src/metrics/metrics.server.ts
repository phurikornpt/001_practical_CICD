import { createServer, type Server } from 'http';
import { register } from 'prom-client';

/**
 * Sidecar-only metrics server.
 * Cloud Run multi-container shares localhost; public ingress only hits Nest PORT.
 */
export function startMetricsServer(
  port = Number(process.env.METRICS_PORT ?? 9090),
): Server {
  const server = createServer((req, res) => {
    const path = req.url?.split('?')[0];
    if (path !== '/metrics') {
      res.statusCode = 404;
      res.end();
      return;
    }

    void register
      .metrics()
      .then((body) => {
        res.setHeader('Content-Type', register.contentType);
        res.end(body);
      })
      .catch((err: unknown) => {
        res.statusCode = 500;
        res.end(err instanceof Error ? err.message : 'metrics error');
      });
  });

  // ponytail: 127.0.0.1 พอ — sidecar อยู่ netns เดียวกัน; ไม่เปิด public
  server.listen(port, '127.0.0.1');
  return server;
}
