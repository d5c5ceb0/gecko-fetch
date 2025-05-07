import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746580997174 implements MigrationInterface {
    name = 'AutoMigration1746580997174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pools" DROP CONSTRAINT "UQ_8f9d6a1e9ca7c169ba22b77d0ef"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pools" ADD CONSTRAINT "UQ_8f9d6a1e9ca7c169ba22b77d0ef" UNIQUE ("address")`);
    }

}
