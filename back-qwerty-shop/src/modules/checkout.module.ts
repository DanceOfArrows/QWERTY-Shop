import { Module } from '@nestjs/common';

import { CheckoutResolver } from './../resolvers/checkout.resolver';
import * as Services from '../services/exportServices';

const { CheckoutService, PrismaService } = Services;

@Module({
    imports: [],
    providers: [CheckoutResolver, CheckoutService, PrismaService],
    exports: [CheckoutService],
})
export class CheckoutModule { }
