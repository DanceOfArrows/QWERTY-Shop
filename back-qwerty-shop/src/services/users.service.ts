import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from './exportServices';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async createUser({ email, password }) {
        const hashed_password = await bcrypt.hash(password, 10);
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            throw new Error(`A user with the email ${email} already exists`);
        } else {
            const newUser = await this.prisma.user.create({
                data: {
                    email,
                    password: hashed_password
                }
            });
            await this.prisma.cart.create({
                data: {
                    user_id: newUser.id
                }
            });
            return 'Account creation successful.';
        }
    };

    async getUserData(email) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email
            },
        });

        if (!existingUser) {
            throw new Error(`Could not find a user with the email "${email}".`);
        } else {
            const { password, ...userInfo } = existingUser;

            const userCart = await this.prisma.cart.findUnique({
                where: {
                    user_id: existingUser.id
                },
            });

            const cartItems = await this.prisma.cartItem.findMany({
                where: {
                    cart_id: userCart.id,
                },
                select: {
                    id: false,
                    item_variation: {
                        select: {
                            option: true,
                            variant: true,
                            quantity: true,
                            price: true,
                            image: true,
                            item: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                    description: true,
                                    type: true,
                                }
                            }
                        }
                    },
                    quantity: true,
                }
            });

            console.log(cartItems)

            const userAddresses = await this.prisma.address.findMany({
                where: {
                    user_id: existingUser.id
                },
                select: {
                    id: false,
                    user_id: false,
                    country: true,
                    full_name: true,
                    phone_number: true,
                    address_line_one: true,
                    address_line_two: true,
                    city: true,
                    state: true,
                    zip_code: true,
                    default: true
                }
            });

            console.log(cartItems)
            console.log(userAddresses)

            return { addresses: userAddresses, cart: cartItems, ...userInfo };
        }

    };
};