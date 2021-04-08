import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';

import { Item, ItemDocument } from '../items/item.model';
import { Order, OrderDocument } from './order.model';
import { UserNoPW, UserDocument } from '../users/user.model';

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
}
