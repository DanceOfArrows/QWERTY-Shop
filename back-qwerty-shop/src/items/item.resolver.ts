import {
    Field,
    Resolver,
    Query,
    Mutation,
    Args,
    Context,
    ObjectType
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from "../auth/auth.gaurd";
import { Item, ItemDocument } from './item.model';
import { ItemsService } from './items.service';

@ObjectType()
class ItemType {
    @Field(() => [Item])
    items: Item[];

    @Field(() => String)
    type: string;
}

@ObjectType()
class SingleItemType {
    @Field(() => Item)
    item: Item;

    @Field(() => String)
    type: string;
}

@Resolver(() => Item)
export class ItemResolver {
    constructor(
        private itemsService: ItemsService
    ) { }

    @Query(() => ItemType)
    async findItemsByType(@Args('itemType') itemType: string) {
        const items = await this.itemsService.findItemsByType(itemType);

        if (items && items.length > 0) {
            return { items, type: itemType };
        } else {
            throw new Error(`Could not find items in the ${itemType} category.`);
        }
    };

    @Query(() => SingleItemType)
    async findItemById(@Args('itemId') itemId: string) {
        const item = await this.itemsService.findItemById(itemId);

        if (item) {
            return { item, type: item.type };
        } else {
            throw new Error(`Could not find an item with the id "${itemId}"`);
        }
    };
};