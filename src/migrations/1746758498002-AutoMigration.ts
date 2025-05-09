import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746758498002 implements MigrationInterface {
    name = 'AutoMigration1746758498002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`smart_address\` DROP COLUMN \`lastBalance\``);
        await queryRunner.query(`ALTER TABLE \`smart_address\` ADD \`lastBalance\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`smart_address\` DROP COLUMN \`lastBalance\``);
        await queryRunner.query(`ALTER TABLE \`smart_address\` ADD \`lastBalance\` decimal NOT NULL DEFAULT '0'`);
    }

}
