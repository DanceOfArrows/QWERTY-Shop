import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { Address, CartItem } from '../users/user.model';

@ObjectType()
@Schema()
export class Order {
    @Field(() => Address)
    @Prop({ required: true, unique: false })
    address: Address;

    @Field(() => [CartItem])
    @Prop({ required: true })
    items: CartItem[];

    @Field(() => ID)
    @Prop({ required: true })
    user_id: MongooseSchema.Types.ObjectId;

    @Field(() => Date)
    @Prop({ required: true })
    saleDate: Date;
};

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);