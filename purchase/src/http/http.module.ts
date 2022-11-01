import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';
import { DatabaseModule } from '../database/database.module';
import { CustomersService } from '../services/customers.service';
import { ProductsService } from '../services/products.service';
import { PurchasesService } from '../services/pruschases.service';
import { CustomersResolver } from './graphql/resolvers/customers.resolver';
import { ProductsResolver } from './graphql/resolvers/product.resolver';
import { PurchaseResolver } from './graphql/resolvers/purchase.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    ProductsResolver,
    PurchasesService,
    PurchaseResolver,
    ProductsService,
    CustomersResolver,
    CustomersService,
  ],
})
export class HttpModule {}
