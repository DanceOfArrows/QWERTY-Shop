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
// import { Address, CartItem, UserNoPW } from '../users/user.model';
// import { Schema as MongooseSchema } from 'mongoose';

@ObjectType()
class AuthToken {
    @Field(() => String)
    token: string;
};

@Resolver('Auth')
export class AuthResolver {
    constructor(
        private authService: AuthService
    ) { }

    @Mutation(() => AuthToken)
    async signIn(@Args('signInData') signInData: SignInInput) {
        return await this.authService.login(signInData);
    };
};