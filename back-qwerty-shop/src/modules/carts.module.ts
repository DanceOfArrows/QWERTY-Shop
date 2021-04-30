import { Module } from '@nestjs/common';

import { CartResolver } from '../resolvers/cart.resolver';
import { CartsService } from '../services/carts.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  providers: [PrismaService, CartResolver, CartsService],
  exports: [CartsService],
})
export class CartsModule { }
