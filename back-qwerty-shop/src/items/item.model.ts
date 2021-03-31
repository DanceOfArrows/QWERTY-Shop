import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Color Image Price Quantity Size
@ObjectType()
class PQS {
    @Field(() => Number)
    @Prop({ required: true })
    price: number;

    @Field(() => Number)
    @Prop({ required: true })
    quantity: number;

    @Field(() => String)
    @Prop({ required: true, unique: true })
    size: string;
};

// Color Image Price Quantity Size
@ObjectType()
class CIPQS {
    @Field(() => String)
    @Prop({ required: true, unique: true })
    color: string;

    @Field(() => String)
    @Prop()
    image: string;

    @Field(() => [PQS])
    @Prop()
    variants: PQS[];
};

// Schema for items collection
@ObjectType()
@Schema()
export class Item {
    @Field(() => ID)
    _id: MongooseSchema.Types.ObjectId;

    @Field(() => [CIPQS])
    @Prop()
    CIPQS: CIPQS[];

    @Field(() => String)
    @Prop()
    description: string;

    @Field(() => String)
    @Prop()
    displayImage: string;

    @Field(() => String)
    @Prop({ required: true, unique: true })
    name: string;

    @Field(() => String)
    @Prop()
    type: string;
};

export type ItemDocument = Item & Document;

export const ItemSchema = SchemaFactory.createForClass(Item);