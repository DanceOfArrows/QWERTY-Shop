import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'

import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CartsService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async addToCart({ userId, variantId, quantity }) {
        try {
            const userCart = await this.prisma.cart.findUnique({
                where: {
                    user_id: userId,
                }
            });

            /* Check if item already exists in cart */
            const existingItem = await this.prisma.cartItem.findFirst({
                where: {
                    cart_id: userCart.id,
                    item_variation_id: variantId,
                },
            });

            /* Get item variation to compare quantity */
            const itemVariation = await this.prisma.itemVariation.findFirst({
                where: {
                    id: variantId
                },
            });

            /* Check if quantity being added is greater than allowed */
            if (quantity <= itemVariation.quantity || (existingItem != null && existingItem.quantity + quantity <= itemVariation.quantity)) {
                /* If an item is in a user's cart -> set quantity else -> create */
                if (existingItem) {
                    await this.prisma.cartItem.update({
                        where: {
                            id: existingItem.id
                        },
                        data: {
                            quantity: {
                                increment: quantity
                            }
                        }
                    });
                } else {
                    await this.prisma.cartItem.create({
                        data: {
                            cart_id: userCart.id,
                            item_variation_id: variantId,
                            quantity
                        }
                    })
                }
            } else {
                throw new Error('Unable to add to cart since item quantity greater than available amount.')
            }


            return 'Successfully added to cart.'
        } catch (e) {
            console.error(e);
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error('Failed to add item to cart.');
            } else throw e;
        }
    };

    async emptyCart(userId) {
        try {
            /* Get user's cart */
            const userCart = await this.prisma.cart.findUnique({
                where: {
                    user_id: userId,
                }
            });

            /* Delete all items that have the cart_id belonging to userId */
            await this.prisma.cartItem.deleteMany({
                where: {
                    cart_id: userCart.id,
                }
            });

            return 'Successfully emptied cart.'
        } catch (e) {
            console.error(e);
            throw new Error('Failed to empty items from cart.');
        }
    };
};