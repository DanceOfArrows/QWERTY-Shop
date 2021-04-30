import {
    Args,
    Mutation,
    Resolver,
} from '@nestjs/graphql';

import { AuthService } from '../services/auth.service';
import { AuthToken } from '../models/auth.model';
import { LoginInput } from '../inputs/auth.inputs';

@Resolver('Auth')
export class AuthResolver {
    constructor(
        private authService: AuthService
    ) { }

    @Mutation(() => AuthToken)
    async login(
        @Args('loginData') loginData: LoginInput
    ) {
        return await this.authService.verifyUser(loginData);
    };
};