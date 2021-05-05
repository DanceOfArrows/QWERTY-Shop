import {
    Args,
    Context,
    Mutation,
    Resolver,
} from '@nestjs/graphql'; import { UseGuards } from '@nestjs/common';

import { AuthGuard } from "./auth.gaurd";
import { AddressInfoInput } from '../inputs/address.inputs';
import { AddressesService } from '../services/exportServices';
import { Address } from '../models/address.model';
import { User } from '../models/user.model';

@Resolver(() => Address)
export class AddressResolver {
    constructor(
        private addressesService: AddressesService
    ) { }

    @Mutation(() => String)
    @UseGuards(AuthGuard)
    addAddress(
        @Args('addressInfo') addressInfo: AddressInfoInput,
        @Context('user') user: User
    ) {
        return this.addressesService.addAddress(addressInfo, user.id);
    };
};