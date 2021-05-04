import { Module } from '@nestjs/common';

import { AddressResolver } from './../resolvers/address.resolver';
import * as Services from '../services/exportServices';

const { AddressesService, PrismaService } = Services;

@Module({
    imports: [],
    providers: [AddressResolver, AddressesService, PrismaService],
    exports: [AddressesService],
})
export class AddressesModule { }
