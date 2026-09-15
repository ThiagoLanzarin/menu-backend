import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { GuestCheckService } from '../guest-checks/guest-check.service';
import { ProductService } from '../products/product.service';

@Injectable()
export class OrderService {
    constructor(
        private readonly guestCheckService: GuestCheckService,
        private readonly productService: ProductService,

        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) {}

    private async prepareItem(itemDto: CreateOrderItemDto): Promise<OrderItem> {
        const product = await this.productService.findOne(itemDto.productId);
        const price = Number(product.price);
        const subtotal = price * itemDto.quantity;

        return this.orderItemRepository.create({
            product,
            quantity: itemDto.quantity,
            price,
            subtotal,
        });
    }

    async create(dto: CreateOrderDto): Promise<Order> {
        //regra 1: verificar se tem comanda aberta para a mesa
        const guestCheck = await this.guestCheckService.findOrCreateOpened(dto.spotId);

        //monta os itens do pedido e o totalizador
        const items: OrderItem[] = [];
        let total = 0;

        for (const itemDto of dto.items) {
            const item = await this.prepareItem(itemDto);
            items.push(item);
            total += Number(item.subtotal);
        }

        const order = this.orderRepository.create({
            guestCheck,
            status: OrderStatus.NEW,
            total,
            items,
        });

        return this.orderRepository.save(order);
    }
}
