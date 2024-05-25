import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserService } from './user/user.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(LocalStrategy) {
  constructor(private userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordIsValid = await this.userService.checkPassword(password, user.hash);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
}