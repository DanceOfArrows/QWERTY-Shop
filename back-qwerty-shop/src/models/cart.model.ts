import { Field, ObjectType } from '@nestjs/graphql';

import { CartItem } from './cart-item.model';

@ObjectType()
export class Cart {
    @Field(() => [CartItem], { description: 'Cart items' })
    items: CartItem[]
}

