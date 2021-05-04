import { Injectable } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class AddressesService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async addAddress(addressInfo, userId) {
        try {
            const {
                country,
                full_name,
                phone_number,
                address_line_one,
                address_line_two,
                city,
                state,
                zip_code,
                default: default_address,
            } = addressInfo;

            if (default_address) {
                await this.prisma.address.updateMany({
                    where: {
                        user_id: userId,
                    },
                    data: {
                        default: false
                    }
                })
            };

            await this.prisma.address.create({
                data: {
                    country,
                    full_name,
                    phone_number,
                    address_line_one,
                    address_line_two,
                    city,
                    state,
                    zip_code,
                    default: default_address,
                    user_id: userId
                }
            });

            return 'Successfully added address.'
        } catch (e) {
            console.error(e);
            throw new Error('Failed to add address.')
        }
    }
};