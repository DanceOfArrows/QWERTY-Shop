import { Field, InputType } from '@nestjs/graphql';

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

    @Field(() => [String], { nullable: true })
    cart?: string[];
};