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

import { Order } from './order.model';

@Resolver(() => Order)
export class OrderResolver {

};