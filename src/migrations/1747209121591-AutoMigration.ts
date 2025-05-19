import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747209121591 implements MigrationInterface {
    name = 'AutoMigration1747209121591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`content\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`content\` ADD \`content\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`content\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`content\` ADD \`content\` varchar(255) NOT NULL`);
    }

}
