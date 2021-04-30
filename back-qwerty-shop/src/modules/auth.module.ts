import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthResolver } from '../resolvers/auth.resolver';
import { UsersModule } from './users.module';
import * as Services from '../services/exportServices';

const { AuthService, PrismaService } = Services;

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN
        },
      }),
    })
  ],
  providers: [AuthResolver, AuthService, PrismaService]
})
export class AuthModule { }