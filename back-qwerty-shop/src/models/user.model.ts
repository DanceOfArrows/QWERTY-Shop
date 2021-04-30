import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Address } from './address.model'

@ObjectType()
export class User {
    @Field(() => Int, { description: 'User Id in PostgreSQL' })
    id!: number;

    @Field(() => String, { description: 'User email' })
    email!: string;

    @Field(() => [Address], { description: 'User addresses' })
    addresses: Address[];

    @Field({ description: 'User cart with item(s)' })
    cart: string;
}