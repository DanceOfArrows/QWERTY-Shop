import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddressInfoInput {
    @Field()
    country: string;

    @Field()
    full_name: string;

    @Field()
    phone_number: string;

    @Field()
    address_line_one: string;

    @Field()
    address_line_two?: string;

    @Field()
    city: string;

    @Field()
    state: string;

    @Field()
    zip_code: string;

    @Field()
    default: boolean;
};