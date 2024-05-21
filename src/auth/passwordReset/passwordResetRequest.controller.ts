// passwordResetRequest.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth/reset-password')
export class PasswordResetRequestController {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  @Post()
  async requestResetPassword(@Body('email') email: string) {
  
    const user = await this.userService.findOneByEmail(email);
  
    if (!user) {
      throw new UnauthorizedException();
    }
  
    const token = this.jwtService.sign({ email }, { expiresIn: '1h' });
    user.passwordResetToken = token;
    await this.userService.saveResetToken(user.email, token);
  
    return { message: 'Password reset token has been sent to your email', token };
  }
}