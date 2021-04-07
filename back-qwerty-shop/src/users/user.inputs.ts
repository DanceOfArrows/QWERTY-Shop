import { Field, ID, InputType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class AddAddressInput {
    @Field()
    country: string;
    @Field()
    fullName: string;
    @Field()
    phoneNumber: string;
    @Field()
    addressLineOne: string;
    @Field()
    addressLineTwo?: string;
    @Field()
    city: string;
    @Field()
    state: string;
    @Field()
    zipCode: string;
    @Field()
    default: boolean;
};

@InputType()
class CartItemInput {
    @Field(() => ID)
    itemId: MongooseSchema.Types.ObjectId;

    @Field(() => String)
    name: string;

    @Field(() => String)
    color: string;

    @Field(() => String)
    size: string;

    @Field(() => Number)
    quantity: number;

    @Field(() => String)
    image: string;

    @Field(() => Number)
    price: number;
}

@InputType()
export class CartInput {
    @Field(() => [CartItemInput])
    items: CartItemInput[];
}

@InputType()
export class NewAddressInput {
    @Field()
    email: string;
    @Field()
    country: string;
    @Field()
    fullName: string;
    @Field()
    phoneNumber: string;
    @Field()
    addressLineOne: string;
    @Field()
    addressLineTwo?: string;
    @Field()
    city: string;
    @Field()
    state: string;
    @Field()
    zipCode: string;
    @Field()
    default: boolean;
};

@InputType()
export class CreateUserInput {
    @Field()
    email: string;

    @Field()
    password: string;
};