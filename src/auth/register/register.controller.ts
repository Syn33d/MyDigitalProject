import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcryptjs';

@Controller('auth/register')
export class RegisterController {
  constructor(private users: UserService) {}

  @Post()
  async register(@Body() userDto: CreateUserDto) {
    const user = await this.users.create(userDto);
    return user;
  }
}