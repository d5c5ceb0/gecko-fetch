import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747641422479 implements MigrationInterface {
    name = 'AutoMigration1747641422479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`chat_name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`chat_name\``);
    }

}
