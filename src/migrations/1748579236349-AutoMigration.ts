import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1748579236349 implements MigrationInterface {
    name = 'AutoMigration1748579236349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` ADD \`bot_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` ADD \`node_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` CHANGE \`twitter_id\` \`twitter_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` CHANGE \`twitter_name\` \`twitter_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` CHANGE \`start_time\` \`start_time\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` CHANGE \`chat_id\` \`chat_id\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` CHANGE \`chat_id\` \`chat_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` CHANGE \`start_time\` \`start_time\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` CHANGE \`twitter_name\` \`twitter_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` CHANGE \`twitter_id\` \`twitter_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` DROP COLUMN \`node_id\``);
        await queryRunner.query(`ALTER TABLE \`kol_fetch_date\` DROP COLUMN \`bot_name\``);
    }

}
