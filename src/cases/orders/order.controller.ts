import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order';

@Controller('orders')
export class OrderController {
    constructor(private readonly service: OrderService) {}

    @Post()
    create(
        @Body()
        dto: CreateOrderDto,
    ): Promise<Order> {
        return this.service.create(dto);
    }
}
