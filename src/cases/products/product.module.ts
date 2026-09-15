import { Module } from "@nestjs/common";
import { Product } from "./product.entity";
import { Category } from "../categories/category.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({

    imports: [TypeOrmModule.forFeature([Product, Category])],

    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})

export class ProductModule {

}