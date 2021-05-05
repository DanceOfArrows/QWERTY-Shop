import {
    Args,
    Context,
    Mutation,
    Resolver,
} from '@nestjs/graphql'; import { UseGuards } from '@nestjs/common';

import { AuthGuard } from "./auth.gaurd";
import { CheckoutCartInput } from '../inputs/checkout.inputs';
import { CheckoutService } from '../services/exportServices';
import { User } from '../models/user.model';

@Resolver(() => String)
export class CheckoutResolver {
    constructor(
        private checkoutService: CheckoutService
    ) { }

    @Mutation(() => String)
    @UseGuards(AuthGuard)
    checkout(
        @Args('cart') cartObj: CheckoutCartInput,
        @Args('addressId') addressId: Number,
        @Context('user') user: User
    ) {
        return this.checkoutService.checkout(cartObj.cart, addressId, user.id);
    };
};