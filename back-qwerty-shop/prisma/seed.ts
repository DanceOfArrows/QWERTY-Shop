import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();
  console.log('\x1b[36m%s\x1b[0m', '-----------------------------');
  console.log('\x1b[32m', 'Seeding...');
  console.log('\x1b[36m%s\x1b[0m', '-----------------------------');

  console.log('Seeding types...');
  await prisma.type.createMany({
    data: [
      { name: 'Accessories' },
      { name: 'Cases' },
      { name: 'DIY Kits' },
      { name: 'Keycaps' },
      { name: 'New Arrivals' },
      { name: 'Switches' },
    ],
  });

  console.log('\x1b[36m%s\x1b[0m', '-----------------------------');
  console.log('\x1b[32m', 'Seeding main item...');

  await prisma.item.createMany({
    data: [
      {
        name: 'Kat Eternal',
        description:
          'Designed by Minterly Studios, this Kindred inspired keyset is the first KAT set to make use of reverse dyesub in a big way! The purple to teal gradient will look great with many boards, all at an affordable price.',
        image:
          'https://cdn.shopify.com/s/files/1/0238/7342/1376/products/Planck_Eternal_2019-Sep-15_03-15-49PM-000_CustomizedView16758096569_540x.png?v=1572499558',
        type_id: 4,
      },
      {
        name: 'HK Gaming Sublimation',
        description:
          'Great value set of Cherry profile keycaps.  Constructed from PBT plastic.',
        image:
          'https://images-na.ssl-images-amazon.com/images/I/81Y3ssWH7CL._AC_SL1500_.jpg',
        type_id: 4,
      },
      {
        name: 'YMDK White Gray Black',
        description:
          'Beautiful mix of simplicity and affordability.  Great for those who want blank keys or want the legends on the side of their keycaps.',
        image:
          'https://m.media-amazon.com/images/I/61ZnOulAoGL._AC_SL1500_.jpg',
        type_id: 4,
      },
      {
        name: 'Wooden Wrist Rest',
        description:
          'A wooden wrist rest for your 65 - 75% keybaords.  Made of 100% real wood, so there may be some imperfections.',
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/12_d134d952-3044-4611-a818-800979e1dbb9_360x.jpg?v=1623380186',
        type_id: 1,
      },
      {
        name: 'Tofu84 Aluminum Case',
        description:
          'An aluminum case with a seven degree angle.  Comes in a variety of colors for hobbyist to choose from!  Fits the KBD75 Rev 2.0 PCB',
        image:
          'https://ae01.alicdn.com/kf/H5eadd6becb834f98a275beef11ad542fE.jpg',
        type_id: 2,
      },
      {
        name: 'Tofu60 DIY Kit',
        description:
          'A DIY kit containing the case (with feet), pcb, plate, and stabilzers.  Switches and keycaps are not included!',
        image:
          'https://ae01.alicdn.com/kf/Hf5258faf297c4f34a55837c00aec4546X.jpg',
        type_id: 3,
      },
      {
        name: 'D60Lite x GMK Pharaoh',
        description:
          'Keyboard collab between GMK Pharaoh X KBDFans D60 Lite.  DZ60RGB-WKL/DZ60RGB ANSI V2 PCB (hotswappable), polycarbonate plate, gasket mounted, 6 degree angle.',
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/files/D60-Lite-4_2048x2048.jpg?v=1622449060',
        type_id: 5,
      },
      {
        name: 'Kailh',
        description: 'Keyboard switches made by Kailh!  Comes in sets of 10.',
        image: 'https://ae01.alicdn.com/kf/HTB19batlxWYBuNjy1zkq6xGGpXaL.jpg',
        type_id: 6,
      },
      {
        name: 'Cherry',
        description: 'Keyboard switches made by Cherry!  Comes in sets of 8.',
        image:
          'https://ae01.alicdn.com/kf/HTB1ir1dbBHH8KJjy0Fbq6AqlpXaV.jpg?size=61382&height=1000&width=1000&hash=90c422eac028819f4000eaa7d694e096',
        type_id: 6,
      },
    ],
  });

  console.log('\x1b[36m%s\x1b[0m', '-----------------------------');
  console.log('\x1b[32m', 'Seeding main item variations...');

  await prisma.itemVariation.createMany({
    data: [
      {
        option: 'Alphas',
        variant: 'OSFA',
        quantity: 100,
        price: 28.0,
        image:
          'https://cdn.shopify.com/s/files/1/0238/7342/1376/products/Alphas-01_540x.png?v=1572499558',
        item_id: 1,
      },
      {
        option: '60s/TKL Mods (Icon)',
        variant: '60%',
        quantity: 100,
        price: 73.0,
        image:
          'https://cdn.shopify.com/s/files/1/0238/7342/1376/products/60_-_TKL_Icons-01_540x.png?v=1572499558',
        item_id: 1,
      },
      {
        option: '139 Keys',
        variant: '9009',
        quantity: 100,
        price: 40.0,
        image:
          'https://m.media-amazon.com/images/I/81+QQZ+mGnL._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '139 Keys',
        variant: 'Bee',
        quantity: 100,
        price: 40.0,
        image:
          'https://m.media-amazon.com/images/I/81SiBbdAbeL._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '139 Keys',
        variant: 'Beta',
        quantity: 100,
        price: 40.0,
        image:
          'https://m.media-amazon.com/images/I/714pG3-0xJS._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '139 Keys',
        variant: 'BoW',
        quantity: 100,
        price: 40.0,
        image:
          'https://m.media-amazon.com/images/I/714aDUjUtwL._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '139 Keys',
        variant: 'Canvas',
        quantity: 100,
        price: 50.0,
        image:
          'https://m.media-amazon.com/images/I/81+y82aTHxL._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '139 Keys',
        variant: 'Chalk',
        quantity: 100,
        price: 40.0,
        image:
          'https://images-na.ssl-images-amazon.com/images/I/71mZCZyjYvL._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '139 Keys',
        variant: 'Dreamer',
        quantity: 100,
        price: 50.0,
        image:
          'https://m.media-amazon.com/images/I/81hSWfA3PJL._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '139 Keys',
        variant: 'Dreamscape',
        quantity: 100,
        price: 50.0,
        image:
          'https://m.media-amazon.com/images/I/71oZHuOHvcS._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '139 Keys',
        variant: 'Stealth Dolch',
        quantity: 100,
        price: 40.0,
        image:
          'https://m.media-amazon.com/images/I/71RnzUI5gYS._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '139 Keys',
        variant: 'White & Red',
        quantity: 100,
        price: 40.0,
        image:
          'https://m.media-amazon.com/images/I/81CCX8OzxZL._AC_SL1500_.jpg',
        item_id: 2,
      },
      {
        option: '61',
        variant: 'Blank',
        quantity: 100,
        price: 22.0,
        image:
          'https://m.media-amazon.com/images/I/617r3Mb6J9L._AC_SL1500_.jpg',
        item_id: 3,
      },
      {
        option: '61',
        variant: 'Side Print',
        quantity: 100,
        price: 22.0,
        image:
          'https://m.media-amazon.com/images/I/61ZnOulAoGL._AC_SL1500_.jpg',
        item_id: 3,
      },
      {
        option: '87',
        variant: 'Blank',
        quantity: 100,
        price: 24.0,
        image:
          'https://m.media-amazon.com/images/I/61EHVpKEnxL._AC_SL1500_.jpg',
        item_id: 3,
      },
      {
        option: '87',
        variant: 'Side Print',
        quantity: 100,
        price: 24.0,
        image:
          'https://images-na.ssl-images-amazon.com/images/I/61IlxoQAhcL._AC_SL1500_.jpg',
        item_id: 3,
      },
      {
        option: '65% - 75%',
        variant: 'Walnut',
        quantity: 100,
        price: 20.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/14_c17b1a01-4e02-4e60-a052-003740694b9f_1800x1800.jpg?v=1623380186',
        item_id: 4,
      },
      {
        option: '65% - 75%',
        variant: 'Rosewood',
        quantity: 100,
        price: 20.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/16_da5a545b-6821-40da-a691-d83426f04ce9_1800x1800.jpg?v=1623380186',
        item_id: 4,
      },
      {
        option: '65% - 75%',
        variant: 'Zebra',
        quantity: 100,
        price: 20.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/15_49e9619c-9801-459a-bb16-bcec2e01bc65_1800x1800.jpg?v=1623380186',
        item_id: 4,
      },
      {
        option: '65% - 75%',
        variant: 'Wenge',
        quantity: 100,
        price: 20.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/13_72c966b3-e4db-458d-a4f6-3f085cc4b289_1800x1800.jpg?v=1623380186',
        item_id: 4,
      },
      {
        option: 'Tofu 84',
        variant: 'Black',
        quantity: 100,
        price: 100.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/8b9cc7c9808a81fc8db0eaf67a4d79d7_68ac1709-c4ac-425f-a644-3df8f6bb2f03_1800x1800.jpg?v=1622855449',
        item_id: 5,
      },
      {
        option: 'Tofu 84',
        variant: 'Burgundy',
        quantity: 100,
        price: 100.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/658baabe15b30353f6c8386a00a112e1_1800x1800.jpg?v=1622855449',
        item_id: 5,
      },
      {
        option: 'Tofu 84',
        variant: 'Tiffany',
        quantity: 100,
        price: 100.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/8b205c8d8e230c81792377c6ffb693c2_1800x1800.jpg?v=1622855449',
        item_id: 5,
      },
      {
        option: 'Tofu 84',
        variant: 'Blue',
        quantity: 100,
        price: 100.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/cc456c324ff850d0107bbc6307b6523e_f6539264-e639-4ade-bf54-292db680eb6e_1800x1800.jpg?v=1622855449',
        item_id: 5,
      },
      {
        option: 'Tofu 84',
        variant: 'Purple',
        quantity: 100,
        price: 100.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/725dfe67448c8805088597ecc1ec1cba_ead5e9e1-5756-4972-8c28-9c1d3c662239_750x.jpg?v=1622855449',
        item_id: 5,
      },
      {
        option: 'Tofu 84',
        variant: 'Silver',
        quantity: 100,
        price: 100.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/5689ad8cf382a0b5e30109095f2c5cb5_2806daaf-657e-4ae2-9680-cba86d4d19de_1800x1800.jpg?v=1622855449',
        item_id: 5,
      },
      {
        option: 'Tofu 84',
        variant: 'E-white',
        quantity: 100,
        price: 120.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/3c86e19efbc0b331ae9a210cfb5ebbd5_d4e76685-d709-41cb-b414-02a7640d3be4_1800x1800.jpg?v=1622855449',
        item_id: 5,
      },
      {
        option: 'Tofu 84',
        variant: 'E-coat grey',
        quantity: 100,
        price: 120.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/788fe77749567249a9895a49894edd52_1800x1800.jpg?v=1622855449',
        item_id: 5,
      },
      {
        option: 'Tofu 84',
        variant: 'Grey',
        quantity: 100,
        price: 100.0,
        image:
          'https://cdn.shopify.com/s/files/1/1473/3902/products/14_95aae35e-4808-4096-9ef0-33e6ee5d2591_1800x1800.jpg?v=1622855449',
        item_id: 5,
      },
      {
        option: 'Tofu 60',
        variant: 'Acrylic',
        quantity: 100,
        price: 165.0,
        image:
          'https://ae01.alicdn.com/kf/Hec56b5a53c8e4868bd589e10cbee71a1Y.jpg',
        item_id: 6,
      },
      {
        option: 'D60 Lite',
        variant: 'GMK Pharaoh',
        quantity: 100,
        price: 119.0,
        image:
          'https://ae01.alicdn.com/kf/Hec56b5a53c8e4868bd589e10cbee71a1Y.jpg',
        item_id: 7,
      },
      {
        option: '3 Pin',
        variant: 'Box Pink',
        quantity: 100,
        price: 8.5,
        image:
          'https://ae01.alicdn.com/kf/H8ad4f8e06b8740cda613542877f8e75dt.jpg',
        item_id: 8,
      },
      {
        option: '3 Pin',
        variant: 'Box Royal',
        quantity: 100,
        price: 8.5,
        image:
          'https://ae01.alicdn.com/kf/Hb2132cc8dc56423c9fc0d9cd433a34834.jpg',
        item_id: 8,
      },
      {
        option: '3 Pin',
        variant: 'Box Navy',
        quantity: 100,
        price: 8.5,
        image:
          'https://ae01.alicdn.com/kf/H9ca05bec45c6407da99a6e7eeda3bfefP.jpg',
        item_id: 8,
      },
      {
        option: '3 Pin',
        variant: 'Box Jade',
        quantity: 100,
        price: 8.5,
        image:
          'https://ae01.alicdn.com/kf/He23735c39f21470abdd74c594b008698R.jpg',
        item_id: 8,
      },
      {
        option: '3 Pin',
        variant: 'MX Red',
        quantity: 100,
        price: 5.0,
        image:
          'https://ae01.alicdn.com/kf/HTB1gcGvXAfb_uJkSmFPq6ArCFXa0.jpg?size=52057&height=1000&width=1000&hash=1f965b42d188cd55f22a3a1495089388',
        item_id: 9,
      },
      {
        option: '3 Pin',
        variant: 'MX Blue',
        quantity: 100,
        price: 5.0,
        image:
          'https://ae01.alicdn.com/kf/HTB1si1lbBDH8KJjSspnq6zNAVXal.jpg?size=61680&height=1000&width=1000&hash=71ddbc727165202dbb4813813201b946',
        item_id: 9,
      },
      {
        option: '3 Pin',
        variant: 'MX Brown',
        quantity: 100,
        price: 5.0,
        image:
          'https://ae01.alicdn.com/kf/HTB1UJexXAfb_uJkSnhJq6zdDVXaG.jpg?size=64621&height=1000&width=1000&hash=ab581581561c78bfacca923199f6e632',
        item_id: 9,
      },
      {
        option: '3 Pin',
        variant: 'MX Black',
        quantity: 100,
        price: 5.0,
        image:
          'https://ae01.alicdn.com/kf/HTB1DUuebtbJ8KJjy1zjq6yqapXaW.jpg?size=58552&height=1000&width=1000&hash=0d4eed8b5c7f001c8636c2b33dab9fea',
        item_id: 9,
      },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
