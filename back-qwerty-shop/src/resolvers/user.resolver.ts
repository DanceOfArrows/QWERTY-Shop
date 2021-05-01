import {
    Args,
    Context,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from "./auth.gaurd";
import { UsersService } from '../services/users.service';
import { FullUser, User } from '../models/user.model';

import { NewUserInput } from '../inputs/user.inputs';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private usersService: UsersService
    ) { }

    @Mutation(() => String)
    register(
        @Args('newUserData') newUserData: NewUserInput
    ) {
        return this.usersService.createUser(newUserData);
    };

    @Query(() => FullUser)
    @UseGuards(AuthGuard)
    getUserData(
        @Context('user') user: User
    ) {
        return this.usersService.getUserData(user.email);
    };
};