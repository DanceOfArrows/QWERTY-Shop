import { Field, ObjectType } from '@nestjs/graphql';

import { Address } from './address.model';
import { CartItem } from './cart-item.model';

export interface CheckoutCartItem {
    order_id: number;
    item_variation_id: number;
    quantity: number;
};

@ObjectType()
export class Order {
    @Field(() => Address, { description: 'Order address' })
    address: Address;

    @Field(() => [CartItem], { description: 'Order items' })
    items: CartItem[];

    @Field(() => Date, { description: 'Order date' })
    order_date: Date;
}