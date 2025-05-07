import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746588321286 implements MigrationInterface {
    name = 'AutoMigration1746588321286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "top_pools" ADD "updated_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "top_pools" DROP COLUMN "updated_at"`);
    }

}
