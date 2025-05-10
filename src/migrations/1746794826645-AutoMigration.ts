import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746794826645 implements MigrationInterface {
    name = 'AutoMigration1746794826645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`smart_address\` ADD \`botname\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`smart_address\` DROP COLUMN \`botname\``);
    }

}
