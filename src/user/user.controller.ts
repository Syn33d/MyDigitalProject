import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { Roles } from 'src/auth/security/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from 'src/auth/security/roles.guard';

@Controller('user')
export class UserController {
  constructor(@InjectDataSource() private users: UserService, private userService: UserService) { }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() json) {
    return this.users.create(json);
  }
  

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Staff)
  @Get()
  async findAll(): Promise<CreateUserDto[]> {
    return this.users.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any | null> {
    return this.users.findOneById(id);
  }

  @Roles(Role.Admin, Role.Staff, Role.Spectator)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() json) {
    return this.users.update(id, json);
  }

  @Roles(Role.Admin, Role.Staff)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
  

  @Post('reset-password')
  async requestPasswordReset(@Body('email') email: string) {
    return this.users.requestPasswordReset(email);
  }

  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body('password') password: string) {
    return this.users.resetPassword(token, password);
  }
}