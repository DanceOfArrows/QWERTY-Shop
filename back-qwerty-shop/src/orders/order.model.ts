import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { Address } from '../users/user.model';
import { CartInput } from '../users/user.inputs';

@ObjectType()
@Schema()
export class Order {
    @Field(() => Address)
    @Prop({ required: true, unique: true })
    address: Address;

    @Field(() => CartInput)
    @Prop({ required: true })
    items: CartInput;

    @Field(() => ID)
    @Prop({ required: true })
    user_id: MongooseSchema.Types.ObjectId;

    @Field(() => Date)
    @Prop({ required: true })
    saleDate: Date;
};

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);