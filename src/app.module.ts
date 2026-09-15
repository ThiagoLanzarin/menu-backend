import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './cases/categories/category.module';
import { ProductModule } from './cases/products/product.module';
import { SpotModule } from './cases/spots/spot.module';
import { GuestCheckModule } from './cases/guest-checks/guest-check.module';
import { OrderModule } from './cases/orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const databaseSchema = configService.get<string>('DATABASE_SCHEMA', 'public');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined in the environment variables');
        }

        const isLocal = /localhost|127\.0\.0\.1/.test(databaseUrl);

        return {
          type: 'postgres',
          url: databaseUrl,
          schema: databaseSchema,
          autoLoadEntities: true,
          synchronize: true,
          ssl: isLocal ? false : { rejectUnauthorized: false },
        };
      },
    }),
    CategoryModule,
    ProductModule,
    SpotModule,
    GuestCheckModule,
    OrderModule,
  ],
})
export class AppModule {}
