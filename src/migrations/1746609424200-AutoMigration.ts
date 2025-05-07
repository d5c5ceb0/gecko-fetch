import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746609424200 implements MigrationInterface {
    name = 'AutoMigration1746609424200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`new_pools\` (\`id\` varchar(36) NOT NULL, \`pool_ids\` text NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`new_pools\``);
    }

}
