import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { SignInInput } from './auth.inputs';
import { User, UserDocument } from '../users/user.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User')
        private userModel: Model<UserDocument>,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) { };

    getUserToken(user: User): string {
        const payload = {
            email: user.email,
        };

        return this.jwtService.sign(payload);
    };

    async login({ email, password }: SignInInput): Promise<any> {
        const user = await this.userModel.findOne({ email }).lean();

        // Return user data without password if the password matches
        if (user && bcrypt.compareSync(password, user.password)) {
            const { password, ...result } = user;
            const token = this.getUserToken(user);

            return { ...result, token };
        } else if (user && !bcrypt.compareSync(password, user.password)) {
            throw new Error('The password is incorrect.');
        };

        if (!user) {
            throw new Error(`A user with the email ${email} was not found.`);
        };

        return null;
    };

    async verifyUserToken(token: string): Promise<User | undefined> {
        const decoded = this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_SECRET_KEY'),
        });

        const { email } = decoded;

        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new Error('Unable to get the user from decoded token.');
        }

        return user;
    };
};