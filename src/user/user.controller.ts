import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/security/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from 'src/auth/security/roles.guard';

@Controller('user')
export class UserController {
  constructor(private users: UserService) { }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Spectator)
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

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Staff, Role.Spectator)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.users.findOneById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Staff, Role.Spectator)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() json) {
    return this.users.update(id, json);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Staff)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}