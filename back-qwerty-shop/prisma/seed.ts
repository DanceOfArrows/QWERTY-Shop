import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();
  console.log('\x1b[36m%s\x1b[0m', '-----------------------------');
  console.log('\x1b[32m', 'Seeding...');
  console.log('\x1b[36m%s\x1b[0m', '-----------------------------');

  console.log('Seeding types...')
  const types = await prisma.type.createMany({
    data: [
      { name: 'Accessories' },
      { name: 'Cases' },
      { name: 'DIY Kits' },
      { name: 'Keycaps' },
      { name: 'New Arrivals' },
      { name: 'Switches' }
    ],
  });

  console.log(types);
  console.log('\x1b[36m%s\x1b[0m', '-----------------------------');
  console.log('\x1b[32m', 'Seeding main item...');

  const kat_eternal_keycaps = await prisma.item.create({
    data: {
      name: 'Kat Eternal',
      description: 'Designed by Minterly Studios, this Kindred inspired keyset is the first KAT set to make use of reverse dyesub in a big way! The purple to teal gradient will look great with many boards, all at an affordable price.',
      image: 'https://cdn.shopify.com/s/files/1/0238/7342/1376/products/Planck_Eternal_2019-Sep-15_03-15-49PM-000_CustomizedView16758096569_540x.png?v=1572499558',
      type_id: 4,
    },
  });

  console.log(kat_eternal_keycaps)
  console.log('\x1b[36m%s\x1b[0m', '-----------------------------');
  console.log('\x1b[32m', 'Seeding main item variations...');

  const kat_eternal_variations = await prisma.itemVariation.createMany({
    data: [
      {
        option: 'Alphas',
        variant: 'OSFA',
        quantity: 100,
        price: 28.00,
        image: 'https://cdn.shopify.com/s/files/1/0238/7342/1376/products/Alphas-01_540x.png?v=1572499558',
        item_id: 1
      },
      {
        option: '60s/TKL Mods (Icon)',
        variant: '60%',
        quantity: 100,
        price: 73.00,
        image: 'https://cdn.shopify.com/s/files/1/0238/7342/1376/products/60_-_TKL_Icons-01_540x.png?v=1572499558',
        item_id: 1
      }
    ]
  });

  console.log(kat_eternal_variations)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });