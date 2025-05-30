import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1748573593897 implements MigrationInterface {
    name = 'AutoMigration1748573593897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` ADD \`twitter_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` ADD \`chat_id\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` DROP COLUMN \`chat_id\``);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` DROP COLUMN \`twitter_name\``);
    }

}
