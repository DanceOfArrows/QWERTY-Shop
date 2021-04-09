
import {
    Args,
    Context,
    Field,
    ID,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';

import { AddAddressInput, CartInput } from './../users/user.inputs';
import { AuthGuard } from './../auth/auth.gaurd';
import { Order } from './order.model';
import { UserNoPW } from './../users/user.model';

@Resolver(() => Order)
export class OrderResolver {
    constructor(
        private ordersService: OrdersService
    ) { }

    @Mutation(() => Order)
    @UseGuards(AuthGuard)
    checkoutOrder(
        @Context('user') user: UserNoPW,
        @Args('cart') cart: CartInput,
        @Args('address') address: AddAddressInput,
    ) {
        return this.ordersService.checkoutOrder(user.email, cart, address);
    }

    @Query(() => [Order])
    @UseGuards(AuthGuard)
    getOrders(
        @Context('user') user: UserNoPW,
    ) {
        return this.ordersService.getOrdersById(user.email);
    }
};