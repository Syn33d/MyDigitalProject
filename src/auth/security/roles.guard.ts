import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IncomingMessage } from "http";
import { ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RolesGuard {
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles || !roles.length) {
            throw new Error('No roles defined');
        }

        // Extraction du JWT
        const request = context.switchToHttp().getRequest();
        if (request instanceof IncomingMessage) {
            const auth = request.headers.authorization;
            const args = auth && auth.split(" ");
            if (args && args.length == 2 && args[0] == "Bearer") {
                const token = args[1];
                const jwts = new JwtService({secret: process.env.JWT_SECRET||"banane"});
                try {
                    const payload = jwts.decode(token) as [key: string];
                    const role = payload['role'];
                    if (!role) {
                        throw new Error('No role found in token');
                    }
                    if (!roles.includes(role)) {
                        throw new Error('User does not have the required role');
                    }
                    return true;
                } catch (error) {
                    throw new Error(`Error decoding token: ${error.message}`);
                }
            } else {
                throw new Error('Invalid authorization header');
            }
        } else {
            throw new Error('Invalid request');
        }
    }
}