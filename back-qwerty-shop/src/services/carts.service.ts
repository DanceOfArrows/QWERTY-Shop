import { Injectable } from '@nestjs/common';

import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CartsService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async addToCart({ userId, variantId, quantity }) {
        const userCart = await this.prisma.cart.findUnique({
            where: {
                user_id: userId,
            }
        });

        /* Check if item already exists in cart */
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cart_id: userCart.id,
                item_variation_id: variantId
            },
        });

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

        return 'Successfully added to cart.'
    };
};