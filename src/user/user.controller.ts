import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../auth/security/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from '../auth/security/roles.guard';
import { StripeService } from '../stripe/stripe.service';
import * as bcrypt from 'bcryptjs';

@Controller('user')
export class UserController {
  constructor(private users: UserService, private stripeService: StripeService) { }

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
  @Roles(Role.Admin, Role.Staff, Role.Spectator)
  @Patch(':id/password')
  async updatePassword(@Param('id') id: string, @Body('password') password: string) {
    const hashedPassword = await bcrypt.hash(password, 15);
    return this.users.updatePassword(id, hashedPassword);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Staff)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.users.remove(id);
  }

  @Get('billing-portal')
  async getBillingPortalUrl(@Query('customerId') customerId: string, @Query('returnUrl') returnUrl: string): Promise<{ url: string }> {
    const url = await this.stripeService.getBillingPortalSessionUrl(customerId, returnUrl);
    return { url };
  }
}