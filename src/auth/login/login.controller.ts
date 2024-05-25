import { Controller, Post, UnauthorizedException, Request } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/sign-in.dto';

@Controller('auth/login')
export class LoginController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    @Post()
    async login(@Request() req): Promise<SignInDto> {
        const { username, password } = req.body;
        const user = await this.userService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const payload = { username: user.email, sub: user.id, role: user.role};
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            expires_in: 3600, // 1 hour
            grant_type: 'password', // Add the missing property 'grant_type'
            scope: '' // Add the missing property 'scope'
        };
    }
}