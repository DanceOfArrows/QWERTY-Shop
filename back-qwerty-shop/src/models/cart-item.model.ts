import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Item, Variation } from './item.model';

@ObjectType()
export class CartItem {
    @Field(() => Item, { description: 'Cart item original item' })
    item: Item;

    @Field(() => Variation, { description: 'Cart item variation' })
    item_variation: Variation;

    @Field(() => Int, { description: 'Cart item variation quantity' })
    quantity: number;
}