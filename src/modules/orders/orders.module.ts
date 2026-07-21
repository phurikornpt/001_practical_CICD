import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { orderMetricsProviders } from '../../metrics/metrics.providers';

@Module({
  controllers: [OrdersController],
  providers: [...orderMetricsProviders],
})
export class OrdersModule {}
