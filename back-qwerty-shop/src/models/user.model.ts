import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Address } from './address.model';
import { CartItem } from './cart-item.model';
import { Order } from './checkout.model';

@ObjectType()
export class User {
    @Field(() => Int, { description: 'User Id in PostgreSQL' })
    id!: number;

    @Field(() => String, { description: 'User email' })
    email!: string;
};

@ObjectType()
export class FullUser extends User {
    @Field(() => [Address], { description: 'User addresses' })
    addresses: Address[];

    @Field(() => [CartItem], { description: 'User cart with item(s)' })
    cart: CartItem[];

    @Field(() => [Order], { description: 'User orders' })
    orders: Order[];
};