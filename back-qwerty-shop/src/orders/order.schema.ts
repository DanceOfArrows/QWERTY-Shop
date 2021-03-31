import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';

import { Address } from '../users/user.model';

@ObjectType()
@Schema()
export class Order {
    @Field(() => Address)
    @Prop({ required: true, unique: true })
    address: Address;

    @Field(() => [Types.ObjectId])
    @Prop({ required: true })
    items_id: [Types.ObjectId];

    @Field(() => Types.ObjectId)
    @Prop({ required: true })
    user_id: Types.ObjectId;

    @Field(() => Date)
    @Prop({ required: true })
    saleDate: Date;
};

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);