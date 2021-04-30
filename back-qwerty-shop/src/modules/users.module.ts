import { Module } from '@nestjs/common';

import { PrismaService, UsersService } from '../services/exportServices';
import { UserResolver } from '../resolvers/exportResolvers';

@Module({
  imports: [],
  providers: [PrismaService, UserResolver, UsersService],
  exports: [UsersService],
})

export class UsersModule { };