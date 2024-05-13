import { Controller, Get, UnauthorizedException, Headers, Post, Body } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/sign-in.dto';
import { LoginDto } from '../dto/login.dto';


@Controller('auth/token')
export class TokenController {
    constructor(private users: UserService, private jwts: JwtService) { }

    @Get()
    async signIn(@Headers('Authorization') auth: string) {
        const args = auth && auth.split(" ");
        if (args && args.length == 2 && args[0] == "Basic") {
            const credentials = Buffer.from(args[1], 'base64').toString("utf-8").split(":");
            const email = credentials[0];
            const password = credentials[1];
            const user = await this.users.findOneByEmail(email);
            if (user && await bcrypt.compare(password, user.hash)) {
                const cr = new SignInDto();
                cr.expires_in = 3600; // 1 hour
                cr.access_token = this.jwts.sign(
                    { id: user.id, role: user.role },
                    { subject: email, expiresIn: "1h" }
                );
                return cr;
            }
        }
        throw new UnauthorizedException();
    }
}