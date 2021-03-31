import {
    Args,
    Field,
    ID,
    Mutation,
    ObjectType,
    Resolver,
} from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { SignInInput } from './auth.inputs';
import { Address, CartItem } from '../users/user.model';
import { Schema as MongooseSchema } from 'mongoose';

@ObjectType()
class AuthUser {
    @Field(() => ID)
    readonly _id: MongooseSchema.Types.ObjectId;
    @Field(() => String)
    readonly email: string;
    @Field(() => [Address])
    addresses: Address[];
    @Field(() => [CartItem])
    cart: CartItem[];
    @Field(() => String)
    token: string;
};

@Resolver('Auth')
export class AuthResolver {
    constructor(
        private authService: AuthService
    ) { }

    @Mutation(() => AuthUser)
    async signIn(@Args('signInData') signInData: SignInInput) {
        return await this.authService.login(signInData);
    };
};