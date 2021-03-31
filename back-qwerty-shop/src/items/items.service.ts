import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';

import { Item, ItemDocument } from './item.model';

@Injectable()
export class ItemsService {
    constructor(
        @InjectModel('Item')
        private itemModel: Model<ItemDocument>,
    ) { }

    async findItemsByType(itemType: string): Promise<ItemDocument[] | undefined> {
        return await this.itemModel.find({ type: itemType });
    };

    async findItemById(itemId: string): Promise<ItemDocument | undefined> {
        return await this.itemModel.findById(itemId);
    };
}