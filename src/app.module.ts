import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
