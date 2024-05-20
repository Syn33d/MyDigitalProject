import { Body, ConflictException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private data: Repository<User>, private jwtService: JwtService) { }

  async create(@Body() json): Promise<any> {
    json.email ||= '';
    json.password ||= '';

    // Hash the password before inserting it into the database
    const hashedPassword = await bcrypt.hash(json.password, 15);

    let result = await this.data.query("INSERT INTO user (email, hash) VALUES (?, ?)", [
      json.email,
      hashedPassword  // Use the hashed password here
    ]);
    json.id = result.insertId;
    return json;
  }

  async createPasswordResetToken(user: User): Promise<string> {
    const token = this.jwtService.sign({ id: user.id });
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 300000); // 5min from now
    await this.data.save(user);
    return token;
  }

  async findAll(): Promise<CreateUserDto[]> {
    const users = await this.data.query("SELECT * FROM user");

    // Mapper les résultats vers les DTO en excluant les champs sensibles
    const userDtos: CreateUserDto[] = users.map(user => {
      const { hash, ...userDto } = user;
      return userDto;
    });

    return userDtos;
  }

  async findOneById(@Param('id') id: string): Promise<any | null> {
    let rows: any[] = await this.data.query("SELECT * FROM user WHERE idUser = ?", [+id]);
    if (rows.length == 1) {
      const { hash, ...userDto } = rows[0];
      return userDto;
    } else {
      return null;
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    const found = this.data.findOneBy({ email });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async findOneByPasswordResetToken(token: string): Promise<User | undefined> {
    const user = await this.data.findOne({ where: { passwordResetToken: token } });
    if (user && user.passwordResetExpires && user.passwordResetExpires.getTime() > Date.now()) {
      return user;
    }
    return undefined;
  }

  async update(@Param('id') id: string, @Body() json) {
    let find = await this.findOneById(id);
    json.id = +id;
    json.lastName ||= find.lastName;
    json.firstName ||= find.firstName;
    json.street ||= find.street;
    json.town ||= find.town;
    json.postalCode ||= find.postalCode;
    json.email ||= find.email;
    json.password ||= find.password;
    await this.data.query("UPDATE user SET lastName = ?, firstName = ?, street = ?, town = ?, postalCode = ?, email = ?, hash = ? WHERE idUser = ?", [
      json.lastName,
      json.firstName,
      json.street,
      json.town,
      json.postalCode,
      json.email,
      json.password,
      json.id
    ]);
    return json;
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 15);
    await this.data.update(id, { hash: hashedPassword, passwordResetToken: null });
  }

  remove(@Param('id') id: string) {
    return this.data.query("DELETE FROM user WHERE idUser = ?", [+id]);
  }

  async requestPasswordReset(@Body('email') email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.createPasswordResetToken(user);
    // Send the token to the user's email. This is application-specific and is not shown here.
  }

  async resetPassword(@Param('token') token: string, @Body('password') password: string) {
    const user = await this.findOneByPasswordResetToken(token);
    if (!user) {
      throw new NotFoundException('Invalid password reset token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.updatePassword(user.id, hashedPassword);
    return { message: 'Password has been reset' };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.data.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.hash)) {
      return user;
    }
    return null;
  }
}
