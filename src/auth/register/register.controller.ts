import { Body, Controller, Post, ConflictException, Request } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../../user/enums/role.enum';
import { Status } from '../../user/enums/status.enum';

@Controller('auth/register')
export class RegisterController {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  @Post()
  async register(@Request() req): Promise<any> {
    const { username, password } = req.body;

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await this.userService.findOneByEmail(username);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Créez un nouvel utilisateur
    const hashedPassword = await bcrypt.hash(password, 15);
    const createUserDto: CreateUserDto = { email: username, password: hashedPassword, role: Role.Spectator, status: Status.Verified };
    const newUser = await this.userService.create(createUserDto);

    const payload = { username: newUser.email, sub: newUser.id, role: newUser.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      expires_in: 3600, // 1 hour
      grant_type: 'password', // Add the missing property 'grant_type'
      scope: '' // Add the missing property 'scope'
    };
  }
}
