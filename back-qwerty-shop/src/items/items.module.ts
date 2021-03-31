import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemResolver } from './item.resolver';
import { ItemSchema } from './item.model';
import { ItemsService } from './items.service';
// import { ObjectIdScalar } from '../ObjectIdScalar';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }])
  ],
  providers: [ItemResolver, ItemsService],
  exports: [ItemsService],
})
export class ItemsModule { }