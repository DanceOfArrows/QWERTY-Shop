import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema()
export class Address {
    @Field(() => String)
    @Prop({ required: true })
    country: string;

    @Field(() => String)
    @Prop({ required: true })
    fullName: string;

    @Field(() => String)
    @Prop({ required: true })
    phoneNumber: string;

    @Field(() => String)
    @Prop({ required: true })
    addressLineOne: string;

    @Field(() => String)
    @Prop({ required: false })
    addressLineTwo?: string;

    @Field(() => String)
    @Prop({ required: true })
    city: string;

    @Field(() => String)
    @Prop({ required: true })
    state: string;

    @Field(() => String)
    @Prop({ required: true })
    zipCode: string;

    @Field(() => Boolean)
    @Prop({ default: false })
    default: boolean;
};

@ObjectType()
@Schema()
export class CartItem {
    @Field(() => String)
    @Prop({ required: true })
    itemId: string;

    @Field(() => String)
    @Prop({ required: true })
    color: string;

    @Field(() => Boolean)
    @Prop({ default: false })
    size: boolean;
};

@ObjectType()
@Schema()
export class User {
    @Field(() => ID)
    _id: MongooseSchema.Types.ObjectId;

    @Field(() => String)
    @Prop({ required: true, unique: true })
    email: string;

    @Field(() => String)
    @Prop({ required: true })
    password: string;

    @Field(() => [Address])
    @Prop()
    addresses: Address[];

    @Field(() => [CartItem])
    @Prop()
    cart: CartItem[];
};

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);