import { Module } from '@nestjs/common';

import { ItemResolver } from './../resolvers/item.resolver';
import * as Services from '../services/exportServices';

const { ItemsService, PrismaService } = Services;

@Module({
    imports: [],
    providers: [ItemResolver, ItemsService, PrismaService],
    exports: [ItemsService],
})
export class ItemsModule { }
