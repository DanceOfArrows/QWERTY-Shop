import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Item {
    @Field({ description: 'Item PostgreSQL ID' })
    id: number;

    @Field({ description: 'Item name' })
    name: string;

    @Field({ description: 'Item image URL' })
    image: string;

    @Field({ description: 'Item description' })
    description: string;

    @Field({ description: 'Item type' })
    type: string;
};

@ObjectType()
export class Variation {
    @Field({ description: 'Item variation PostgreSQL ID' })
    id: number;

    @Field({ description: 'Item variation color' })
    option: string;

    @Field({ description: 'Item variation size' })
    variant: string;

    @Field({ description: 'Item variation quantity' })
    quantity: number;

    @Field(() => String, { description: 'Item variation price' })
    price!: number | string;

    @Field({ description: 'Item variation image' })
    image: string;
};

@ObjectType()
export class ItemAndVariations {
    @Field(() => Item, { description: 'Item PostgreSQL ID' })
    item: Item;

    @Field(() => [Variation], { description: 'Item variations' })
    variations: Variation[];
};