import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'p-1' })
  productId!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;
}

// ponytail: in-memory mock only — swap for real store when needed
const orders = [
  { id: 'o-1', productId: 'p-1', quantity: 2, status: 'pending' },
  { id: 'o-2', productId: 'p-2', quantity: 10, status: 'shipped' },
];

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
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
    const order = {
      id: `o-${orders.length + 1}`,
      ...body,
      status: 'pending',
    };
    orders.push(order);
    return order;
  }
}
