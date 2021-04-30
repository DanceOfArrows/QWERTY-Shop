import { Injectable } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class ItemsService {
    constructor(
        private prisma: PrismaService,
    ) { }

    /* Get all variations of an item and return the item with it's variations */
    async getItemVariations(items, type) {
        return await Promise.all(items.map(async (item) => {
            const itemVariations = await this.prisma.itemVariation.findMany({
                where: {
                    item_id: item.id
                },
                select: {
                    option: true,
                    variant: true,
                    quantity: true,
                    price: true,
                    image: true,
                    id: true,
                    item_id: false
                }
            });

            return { item: { ...item, type }, variations: itemVariations };
        }))
    };

    async getItemById(itemId) {
        const item = await this.prisma.item.findUnique({
            where: {
                id: itemId,
            },
            select: {
                id: true,
                name: true,
                image: true,
                description: true,
                type_id: false,
                type: {
                    select: {
                        id: false,
                        name: true
                    }
                }
            },
        });
        const { type, ...itemInfo } = item;

        const itemVariations = await this.prisma.itemVariation.findMany({
            where: {
                item_id: item.id
            },
            select: {
                option: true,
                variant: true,
                quantity: true,
                price: true,
                image: true,
                id: true,
                item_id: false
            }
        });

        return { item: { ...itemInfo, type: type.name }, variations: itemVariations };
    }

    async getItemsByType(type) {
        /* Get all items based on item type */
        const typeAndItems = await this.prisma.type.findUnique({
            where: {
                name: type,
            },
            include: {
                items: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        description: true,
                        type_id: false,
                    }
                },
            }
        });
        const { items } = typeAndItems;

        if (items && items.length > 0) {
            const itemsAndVariations = await this.getItemVariations(items, type);
            return itemsAndVariations;
        } else {
            throw new Error(`There were no items found in the category "${type}".`);
        }
    };
};