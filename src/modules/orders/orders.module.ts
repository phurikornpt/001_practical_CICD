import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { MetricsModule } from '../../metrics/metrics.module';

@Module({
  imports: [MetricsModule],
  controllers: [OrdersController],
})
export class OrdersModule {}
