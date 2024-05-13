import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { LoginDto } from "../dto/login.dto";
import { SignInDto } from "../dto/sign-in.dto";
import * as bcrypt from 'bcryptjs';

@Controller('auth/login')
export class LoginController {

    constructor(private users: UserService, private jwts: JwtService) { }

    @Post()
    async login(@Body() loginDto: LoginDto) {
        const user = await this.users.validateUser(loginDto.email, loginDto.password);
        if (user){
            const cr = new SignInDto();
            cr.expires_in = 3600; // 1 hour
            cr.access_token = this.jwts.sign(
                { id: user.id, role: user.role },
                { subject: loginDto.email, expiresIn: "1h" }
            );
            return cr;
        }
        throw new UnauthorizedException();
    }
}