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
import { AddAddressInput, CreateUserInput } from './user.inputs';
import { Address, CartItem, User, UserDocument } from './user.model';
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

@Resolver(() => User)
export class UserResolver {
    constructor(
        private usersService: UsersService
    ) { }

    @Mutation(() => UserInfo)
    @UseGuards(AuthGuard)
    addAddress(
        @Context('user') user: User,
        @Args('addAddressData') addAddressData: AddAddressInput,
    ) {
        const newAddressData = { email: user.email, ...addAddressData }
        return this.usersService.addAddress(newAddressData);
    };

    @Mutation(() => String)
    createUser(@Args('createUserData') createUserData: CreateUserInput) {
        return this.usersService.createUser(createUserData);
    };

    @Query(() => User)
    @UseGuards(AuthGuard)
    getUserData(@Context('user') user: User) {
        console.log('Fetching user data!')
        return this.usersService.getUserByEmail(user.email);
    };
};