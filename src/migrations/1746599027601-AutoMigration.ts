import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746599027601 implements MigrationInterface {
    name = 'AutoMigration1746599027601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pools\` ADD \`pool_created_at\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pools\` DROP COLUMN \`pool_created_at\``);
    }

}
