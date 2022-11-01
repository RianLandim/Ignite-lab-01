import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CustomersService } from '../../../services/customers.service';
import { ProductsService } from '../../../services/products.service';
import { PurchasesService } from '../../../services/pruschases.service';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { AuthUser, CurrentUser } from '../../auth/current-user';
import { CreatePurchaseInput } from '../inputs/create-purchase';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(
    private purchasesService: PurchasesService,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}

  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  purchases() {
    return this.purchasesService.listAll();
  }

  @ResolveField()
  product(@Parent() purchase: Purchase) {
    return this.productsService.getById(purchase.productId);
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') input: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    let customer = await this.customersService.getByAuthUserId(user.sub);

    if (!customer) {
      customer = await this.customersService.create({ authUserID: user.sub });
    }

    return this.purchasesService.create({
      productId: input.productId,
      customerId: customer.id,
    });
  }
}
