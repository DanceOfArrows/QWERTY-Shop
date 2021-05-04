import {
    Args,
    Context,
    Mutation,
    Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from "./auth.gaurd";
import { CartsService } from '../services/carts.service';
import { AddItemToCartInput } from '../inputs/cart.inputs';
import { Cart } from '../models/cart.model';
import { User } from '../models/user.model';

@Resolver(() => Cart)
export class CartResolver {
    constructor(
        private cartsService: CartsService
    ) { }


    @Mutation(() => String)
    @UseGuards(AuthGuard)
    addToCart(
        @Context('user') user: User,
        @Args('itemInfo') itemInfo: AddItemToCartInput
    ) {
        return this.cartsService.addToCart({ userId: user.id, ...itemInfo });
    };

    @Mutation(() => String)
    @UseGuards(AuthGuard)
    emptyCart(
        @Context('user') user: User,
    ) {
        return this.cartsService.emptyCart(user.id);
    };
};