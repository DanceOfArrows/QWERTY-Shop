import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from './prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { };

    getUserToken(user): string {
        const payload = {
            id: user.id,
            email: user.email,
        };

        return this.jwtService.sign(payload);
    };

    async verifyUser({ email, password }) {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        /* Throw error if a user is not found */
        if (!user) {
            throw new Error(`A user with the email ${email} was not found.`);
        };

        /* Give token if the password matches */
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = this.getUserToken(user);

            return { token };
        } else if (user && !bcrypt.compareSync(password, user.password)) {
            throw new Error('The password is incorrect.');
        } else {
            return null;
        }
    };

    async verifyUserToken(token) {
        const decoded = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET_KEY,
        });

        const { id, email } = decoded;

        const user = await this.prisma.user.findFirst({
            where: {
                id,
                email
            }
        });
        const { password, ...userInfo } = user;

        if (!user) {
            throw new Error('Unable to get the user from decoded token.');
        }

        return { ...userInfo };
    };
};