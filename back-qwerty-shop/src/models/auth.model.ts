import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthToken {
    @Field({ description: 'JWT access token' })
    token: string;
};