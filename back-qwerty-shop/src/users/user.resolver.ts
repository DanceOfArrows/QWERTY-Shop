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
import { Schema as MongooseSchema } from 'mongoose';

import { AuthGuard } from "../auth/auth.gaurd";
import { AddAddressInput, CartInput, CreateUserInput } from './user.inputs';
import { Address, CartItem, UserNoPW, UserDocument } from './user.model';
import { UsersService } from './users.service';

@ObjectType()
class UserInfo {
    @Field(() => ID)
    readonly _id: MongooseSchema.Types.ObjectId;
    @Field(() => String)
    readonly email: string;
    @Field(() => [Address])
    addresses: Address[];
    @Field(() => [CartItem])
    cart: CartItem[];
};

@Resolver(() => UserNoPW)
export class UserResolver {
    constructor(
        private usersService: UsersService
    ) { }

    @Mutation(() => UserInfo)
    @UseGuards(AuthGuard)
    addAddress(
        @Context('user') user: UserNoPW,
        @Args('addAddressData') addAddressData: AddAddressInput,
    ) {
        return this.usersService.addAddress(user.email, addAddressData);
    };

    @Mutation(() => UserNoPW)
    @UseGuards(AuthGuard)
    async addCartToUser(
        @Context('user') user: UserNoPW,
        @Args('cart') cart: CartInput,
    ) {
        return this.usersService.updateUserCart(user, cart);
    };

    @Mutation(() => String)
    createUser(@Args('createUserData') createUserData: CreateUserInput) {
        return this.usersService.createUser(createUserData);
    };

    @Query(() => UserNoPW)
    @UseGuards(AuthGuard)
    getUserData(@Context('user') user: UserNoPW) {
        return this.usersService.getUserByEmail(user.email);
    };
};