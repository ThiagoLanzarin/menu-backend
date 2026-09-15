import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { GuestCheckModule } from '../guest-checks/guest-check.module';
import { ProductModule } from '../products/product.module';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem]), GuestCheckModule, ProductModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
