import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Counter, Gauge } from 'prom-client';
import { MockLatency } from '../../common/mock-latency';
import {
  ORDERS_CREATED_TOTAL,
  ORDERS_PENDING,
} from '../../metrics/metrics.tokens';

export class CreateOrderDto {
  @ApiProperty({ example: 'p-1' })
  productId!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;
}

type Order = {
  id: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'shipped';
};

// ponytail: in-memory mock only — swap for real store when needed
const orders: Order[] = [
  { id: 'o-1', productId: 'p-1', quantity: 2, status: 'pending' },
  { id: 'o-2', productId: 'p-2', quantity: 10, status: 'shipped' },
];

@ApiTags('orders')
@Controller('orders')
@UseInterceptors(MockLatency(100, 800)) // heavier path — slower + fatter p99
export class OrdersController {
  constructor(
    @Inject(ORDERS_CREATED_TOTAL)
    private readonly ordersCreated: Counter<string>,
    @Inject(ORDERS_PENDING)
    private readonly ordersPending: Gauge<string>,
  ) {
    this.syncPendingGauge();
  }

  @Get()
  @ApiOperation({ summary: 'List orders (mock)' })
  findAll() {
    return orders;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id (mock)' })
  findOne(@Param('id') id: string) {
    return orders.find((o) => o.id === id) ?? { message: 'not found' };
  }

  @Post()
  @ApiOperation({ summary: 'Create order (mock)' })
  @ApiBody({ type: CreateOrderDto })
  create(@Body() body: CreateOrderDto) {
    try {
      if (
        !body.productId ||
        !Number.isFinite(body.quantity) ||
        body.quantity < 1
      ) {
        this.ordersCreated.inc({ result: 'invalid' });
        return { message: 'invalid productId or quantity' };
      }

      const order: Order = {
        id: `o-${orders.length + 1}`,
        productId: body.productId,
        quantity: body.quantity,
        status: 'pending',
      };
      orders.push(order);
      this.ordersCreated.inc({ result: 'success' });
      this.syncPendingGauge();
      return order;
    } catch {
      this.ordersCreated.inc({ result: 'error' });
      return { message: 'failed to create order' };
    }
  }

  private syncPendingGauge() {
    this.ordersPending.set(orders.filter((o) => o.status === 'pending').length);
  }
}
