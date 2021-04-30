import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class AddItemToCartInput {
    @Field(() => Int, { description: 'variantId to be added to cart' })
    variantId: number

    @Field(() => Int, { description: 'Amount to be added to cart' })
    quantity: number
};