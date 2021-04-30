import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class Address {
    @Field(() => String, { nullable: false })
    country!: string;

    @Field(() => String, { nullable: false })
    full_name!: string;

    @Field(() => String, { nullable: false })
    phone_number!: string;

    @Field(() => String, { nullable: false })
    address_line_one!: string;

    @Field(() => String, { nullable: false })
    address_line_two!: string;

    @Field(() => String, { nullable: false })
    city!: string;

    @Field(() => String, { nullable: false })
    state!: string;

    @Field(() => String, { nullable: false })
    zip_code!: string;

    @Field(() => String, { nullable: false })
    default!: string;
}
