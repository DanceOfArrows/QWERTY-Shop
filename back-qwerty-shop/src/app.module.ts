import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';

import { AppController } from './controllers/app.controller';
import * as Modules from './modules/exportModules';
import * as Services from './services/exportServices';

const { AuthModule, CartsModule, ItemsModule, UsersModule } = Modules;
const {
  AppService,
  CartsService,
  ItemsService,
  PrismaService,
  UsersService
} = Services;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      sortSchema: true,
      playground: true,
      debug: false,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message || error.extensions.exception.response.message,
        };
        return graphQLFormattedError;
      },
    }),
    AuthModule,
    CartsModule,
    ItemsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CartsService,
    ItemsService,
    PrismaService,
    UsersService
  ],
})
export class AppModule { }
