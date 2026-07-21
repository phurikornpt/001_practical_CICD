import {
  Counter,
  Gauge,
  Histogram,
  type CounterConfiguration,
  type GaugeConfiguration,
  type HistogramConfiguration,
  register,
} from 'prom-client';

/** Footgun: prom-client throws on duplicate name — get-or-create แทน. */
export function getOrCreateCounter(
  config: CounterConfiguration<string>,
): Counter<string> {
  return (
    (register.getSingleMetric(config.name) as Counter<string> | undefined) ??
    new Counter(config)
  );
}

export function getOrCreateHistogram(
  config: HistogramConfiguration<string>,
): Histogram<string> {
  return (
    (register.getSingleMetric(config.name) as Histogram<string> | undefined) ??
    new Histogram(config)
  );
}

export function getOrCreateGauge(
  config: GaugeConfiguration<string>,
): Gauge<string> {
  return (
    (register.getSingleMetric(config.name) as Gauge<string> | undefined) ??
    new Gauge(config)
  );
}
