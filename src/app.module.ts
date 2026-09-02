import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    TypeOrmModule.forRootAsync({ 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const databaseSchema = configService.get<string>('DATABASE_SCHEMA', 'public');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined in the environment variables');
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          schema: databaseSchema,
          autoLoadEntities: true,
          synchronize: true,
        };
      }),

     })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
