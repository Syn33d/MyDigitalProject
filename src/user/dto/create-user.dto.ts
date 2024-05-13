import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "../enums/role.enum";

export class CreateUserDto { 
    
    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    street: number;

    @IsNotEmpty()
    town: string;

    @IsNotEmpty()
    postalCode: number;

    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    password: string;
    
    @IsDefined()
    role: Role;
}