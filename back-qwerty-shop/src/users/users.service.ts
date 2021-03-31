import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Address, User, UserDocument } from './user.model';
import { CreateUserInput, NewAddressInput } from './user.inputs';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User')
        private userModel: Model<UserDocument>,
    ) { }

    async addAddress(newAddressInput: NewAddressInput): Promise<UserDocument | undefined> {
        const { email, ...addressInfo } = newAddressInput;
        const user = await this.userModel.findOne({ email });
        let updatedAddresses = [...user.addresses];

        if (addressInfo.default) {
            updatedAddresses.forEach(address => {
                address.default = false;
            });
            updatedAddresses.push(addressInfo);
        } else {
            updatedAddresses.push(addressInfo);
        };

        const updatedUser = await this.userModel.findOneAndUpdate(
            { email },
            { $set: { 'addresses': updatedAddresses } },
            { new: true }
        );

        return updatedUser;
    };

    async createUser({ email, password, cart }: CreateUserInput): Promise<string | undefined> {
        const hashed_password = await bcrypt.hash(password, 10);
        const existingUser = await this.userModel.findOne({ email });

        if (existingUser) {
            throw new Error(`A user with the email ${email} already exists`);
        } else {
            await this.userModel.create({
                email,
                password: hashed_password,
                cart
            });
            return 'Account creation successful.';
        }
    };

    async getUserByEmail(email: string): Promise<UserDocument | undefined> {
        const existingUser = await this.userModel.findOne({ email });

        if (!existingUser) {
            throw new Error(`Could not find a user with the email "${email}".`);
        } else {
            return existingUser;
        }

    };
};