import { MigrationInterface, QueryRunner } from "typeorm";

export class Seed1711304879374 implements MigrationInterface {

    public async up(run: QueryRunner): Promise<void> {
        await run.manager.save(run.manager.create('user', {
            lastName: 'Doe',
            firstName: 'John',
            street: '123 Main St',
            town: 'Springfield',
            postalCode: 12345,
            email: 'john@doe.com',
            password: 'password'
        }));
    }

    public async down(run: QueryRunner): Promise<void> {
    }
}
