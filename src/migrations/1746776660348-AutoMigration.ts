import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746776660348 implements MigrationInterface {
    name = 'AutoMigration1746776660348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`symbol\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`token_address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`price_change_percentage\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`transactions_5m\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`holders\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`top10\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`top10\``);
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`holders\``);
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`transactions_5m\``);
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`price_change_percentage\``);
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`token_address\``);
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`symbol\``);
    }

}
