import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746526799340 implements MigrationInterface {
    name = 'AutoMigration1746526799340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "age" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
    }

}
