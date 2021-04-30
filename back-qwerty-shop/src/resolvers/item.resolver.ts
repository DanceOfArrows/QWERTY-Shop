import {
    Args,
    Query,
    Resolver,
} from '@nestjs/graphql';

import { ItemsService } from '../services/exportServices';
import { Item, ItemAndVariations } from '../models/item.model';

@Resolver(() => Item)
export class ItemResolver {
    constructor(
        private itemsService: ItemsService
    ) { }

    @Query(() => ItemAndVariations)
    getItemById(
        @Args('itemId') itemId: number
    ) {
        return this.itemsService.getItemById(itemId);
    };

    @Query(() => [ItemAndVariations])
    getItemsByType(
        @Args('type') type: string
    ) {
        return this.itemsService.getItemsByType(type);
    };
};