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
    json.lastName ||= 'Unknown';
    json.firstName ||= 'Unknown';
    json.email ||= '';
    json.password ||= '';

    let result = await this.data.query("INSERT INTO user (email, hash, lastName, firstName) VALUES (?, ?, ?, ?)", [
      json.lastName,
      json.firstName,
      json.email,
      json.password  // Use the hashed password here
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
    await this.data.query("UPDATE user SET lastName = ?, firstName = ?, street = ?, town = ?, postalCode = ?, email = ? WHERE idUser = ?", [
      json.lastName,
      json.firstName,
      json.street,
      json.town,
      json.postalCode,
      json.email,
      json.id
    ]);
    return json;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.data.findOneById(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.hash = newPassword;
    user.passwordResetToken = null;
    await this.data.save(user);
  }

  remove(@Param('id') id: string) {
    return this.data.query("DELETE FROM user WHERE idUser = ?", [+id]);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.data.findOne({ where: { email } });
    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.hash);

      if (passwordMatches) {
        return user;
      }
    }
    return null;
  }

  async checkPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async saveResetToken(email: string, token: string) {
    const user = await this.data.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    user.passwordResetToken = token;
    await this.data.save(user);
  }
}
