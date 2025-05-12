import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746803253815 implements MigrationInterface {
    name = 'AutoMigration1746803253815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`base_token_price_usd\``);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`base_token_price_usd\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`reserve_in_usd\``);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`reserve_in_usd\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`reserve_in_usd\``);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`reserve_in_usd\` decimal NULL`);
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`base_token_price_usd\``);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`base_token_price_usd\` decimal NULL`);
    }

}
