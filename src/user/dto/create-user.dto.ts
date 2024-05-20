import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "../enums/role.enum";
import { Status } from "../enums/status.enum";

export class CreateUserDto { 
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    password: string;
    
    @IsDefined()
    role: Role;

    @IsDefined()
    status: Status
}