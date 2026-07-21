import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { MockLatency } from '../../common/mock-latency';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook' })
  name: string;

  @ApiProperty({ example: 120 })
  price: number;
}

// ponytail: in-memory mock only — swap for real store when needed
const products = [
  { id: 'p-1', name: 'Notebook', price: 120 },
  { id: 'p-2', name: 'Pencil', price: 15 },
];

@ApiTags('products')
@Controller('products')
@UseInterceptors(MockLatency(50, 300)) // mid latency
export class ProductsController {
  @Get()
  @ApiOperation({ summary: 'List products (mock)' })
  findAll() {
    return products;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id (mock)' })
  findOne(@Param('id') id: string) {
    return products.find((p) => p.id === id) ?? { message: 'not found' };
  }

  @Post()
  @ApiOperation({ summary: 'Create product (mock)' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() body: CreateProductDto) {
    const product = { id: `p-${products.length + 1}`, ...body };
    products.push(product);
    return product;
  }
}
