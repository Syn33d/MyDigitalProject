// passwordReset.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth/reset-password/confirm')
export class PasswordResetController {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  @Post()
  async confirmResetPassword(@Body('token') token: string, @Body('password') password: string, @Body('email') email: string) {
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || decodedToken.email !== email) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneByEmail(decodedToken.email);
    if (!user || user.passwordResetToken !== token) {
      throw new UnauthorizedException();
    }

    user.hash = password;
    user.passwordResetToken = null;
    await this.userService.updatePassword(user.email, password);
    return { message: 'Password has been reset' };
  }
}
