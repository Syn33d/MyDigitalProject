import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../user/enums/role.enum";
import { User } from "../user/entities/user.entity";
import { faker } from '@faker-js/faker';

const PEOPLE = 3;

export class Mock1711392558474 implements MigrationInterface {
    public async up(run: QueryRunner): Promise<void> {
        await run.manager.save(run.manager.create(User, {
            email: "john.doe@fake.com",
            //fake
            hash: "$2a$12$CYFrNto4RxK1TF1hVbwEIezJYiyoCEDFyB4zA4ONkn0c0Y.c6k8HO",
            lastName: "DOE",
            firstName: "John",
            role: Role.Admin
        }));
    for (let i=1; i<=PEOPLE; i++) {
        await run.manager.save(run.manager.create(User, {
            email: faker.internet.email(),
            //spectator
            hash: "$2a$12$f0WGMeAWX0DtvXpLp./69.fOUb8kIDwupbWjB4c1qC2kphqNHIYwG",
            lastName: faker.person.lastName(),
            firstName: faker.person.firstName(),
            role: Role.Spectator
        }));
    }
}

    public async down(run: QueryRunner): Promise<void> {
        await run.query("DELETE FROM user");
    }

}
