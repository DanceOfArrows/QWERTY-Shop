import { ID } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import mongoose, { Model, Schema as MongooseSchema } from 'mongoose';

import { Item, ItemDocument } from '../items/item.model';
import { Order, OrderDocument } from './order.model';
import { UserNoPW, UserDocument } from '../users/user.model';
import { AddAddressInput, CartInput } from '../users/user.inputs';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel('Item')
        private itemModel: Model<ItemDocument>,
        @InjectModel('Order')
        private orderModel: Model<OrderDocument>,
        @InjectModel('User')
        private userModel: Model<UserDocument>,
    ) { }

    async checkoutOrder(email: string, cart: CartInput, address: AddAddressInput): Promise<Order | undefined> {
        const { items } = cart;

        let itemsById = {};

        /* Add items with the same id to an array inside itemsById */
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const { itemId, color, size, quantity } = item;
            const itemIdStr = itemId.toString();

            if (itemsById[itemIdStr]) itemsById[itemIdStr].push({ color, size, quantity });
            else itemsById[itemIdStr] = [itemId, { color, size, quantity }];
        };

        /* Update each itemId */
        Object.keys(itemsById).forEach(async (itemIdStr) => {
            const itemId = itemsById[itemIdStr][0];

            let itemToUpdate = await this.itemModel.findById(itemId);

            /* Update quantity of each variation in an item */
            for (let i = 1; i < itemsById[itemIdStr].length; i++) {
                const { color, size, quantity } = itemsById[itemIdStr][i];

                let CIPQS = itemToUpdate.CIPQS;
                for (let i = 0; i < CIPQS.length; i++) {
                    const currentColor = CIPQS[i].color;
                    if (currentColor === color) {
                        let variants = CIPQS[i].variants;
                        for (let j = 0; j < variants.length; j++) {
                            const currentSize = variants[j].size;
                            if (currentSize === size) {
                                if (itemToUpdate.CIPQS[i].variants[j].quantity >= quantity) {
                                    itemToUpdate.CIPQS[i].variants[j].quantity -= quantity;
                                };
                            };
                        };
                    };
                };
            };

            itemToUpdate.markModified('CIPQS');
            itemToUpdate.save();
        });

        // for (let i = 0; i < items.length; i++) {
        //     const item = items[i];
        //     const { itemId, color, size, quantity } = item;

        //     await this.itemModel.findById(itemId, (err, item) => {
        //         if (err) throw new Error(`An error occurred while finding an item with id ${itemId}`);

        //         let CIPQS = item.CIPQS;
        //         for (let i = 0; i < CIPQS.length; i++) {
        //             const currentColor = CIPQS[i].color;
        //             if (currentColor === color) {
        //                 let variants = CIPQS[i].variants;
        //                 for (let j = 0; j < variants.length; j++) {
        //                     const currentSize = variants[j].size;
        //                     if (currentSize === size) {
        //                         if (item.CIPQS[i].variants[j].quantity >= quantity) {
        //                             item.CIPQS[i].variants[j].quantity -= quantity;
        //                             item.markModified('CIPQS');
        //                             item.save();
        //                         };
        //                     };
        //                 };
        //             };
        //         };
        //     });
        // };

        const updateUserCart = await this.userModel.findOneAndUpdate({ email }, { $set: { cart: [] } }).lean();

        let newOrder = {
            address,
            items,
            user_id: updateUserCart._id,
            saleDate: new Date()
        }

        return this.orderModel.create(newOrder);
    };

    async getOrdersById(email: string): Promise<Order[] | undefined> {
        const user = await this.userModel.findOne({ email }).lean();

        if (user && user._id) {
            const orders = await this.orderModel.find({ user_id: user._id }).lean();
            return orders;
        } else {
            throw new Error(`A user with the email '${email}' was not found.`);
        }
    }
}
