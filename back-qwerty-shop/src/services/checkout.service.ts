import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'

import { CheckoutCartItem } from '../models/checkout.model';
import { PrismaService } from './prisma.service';

@Injectable()
export class CheckoutService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async checkout(cart, addressId, userId) {
        try {
            /* Check if user exists */
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (existingUser) {
                /* Find address and select user_id that it belongs to */
                const existingAddress = await this.prisma.address.findUnique({
                    where: {
                        id: addressId
                    },
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true
                            }
                        }
                    }
                });

                /* Check if address exists and belongs to user_id submitted */
                if (existingAddress && existingAddress.user.id === userId) {
                    /* Create new order in DB */
                    const newOrder = await this.prisma.order.create({
                        data: {
                            address_id: existingAddress.id,
                            user_id: userId,
                            order_date: new Date(),
                        }
                    });

                    /* Link items in cart to newOrder id and remove from stock */
                    const cartForLineItem = await Promise.all(cart.map(async (item) => {
                        item.order_id = newOrder.id;
                        const { item_variation_id, quantity } = item;

                        await this.prisma.itemVariation.update({
                            where: {
                                id: item_variation_id
                            },
                            data: {
                                quantity: {
                                    decrement: quantity
                                }
                            }
                        });

                        return item;
                    })) as any as [CheckoutCartItem];

                    /* Create a LineItem for each item in cart */
                    await this.prisma.lineItem.createMany({
                        data: cartForLineItem
                    });

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

                    return 'Order placed successfully.'
                } else {
                    throw new Error(`Address with id ${addressId} belonging to user with id ${userId} was not found.`)
                }
            } else {
                throw new Error(`User with id ${userId} was not found.`)
            }
        } catch (e) {
            console.error(e);
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error('Failed to make order.')
            } else throw e;
        }
    }
};