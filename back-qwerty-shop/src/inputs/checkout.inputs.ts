import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
class CartItemInput {
    @Field(() => Int, { description: 'variantId to be added to cart' })
    item_variation_id: number;

    @Field(() => Int, { description: 'Amount to be added to cart' })
    quantity: number;
}

@InputType()
export class CheckoutCartInput {
    @Field(() => [CartItemInput], { description: 'Cart input for checkout' })
    cart: CartItemInput[];
};