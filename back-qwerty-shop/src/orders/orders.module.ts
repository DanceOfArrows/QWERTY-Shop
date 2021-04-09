
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemResolver } from '../items/item.resolver';
import { ItemSchema } from '../items/item.model';
import { ItemsService } from '../items/items.service';
import { OrderResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { OrderSchema } from './order.model';
import { UserResolver } from '../users/user.resolver';
import { UserSchema } from '../users/user.model';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }])
  ],
  providers: [ItemResolver, ItemsService, OrderResolver, OrdersService, UserResolver, UsersService],
  exports: [OrdersService],
})
export class OrdersModule { }
