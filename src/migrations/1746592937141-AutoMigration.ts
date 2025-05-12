import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746592937141 implements MigrationInterface {
    name = 'AutoMigration1746592937141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`age\` int NOT NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`top_pools\` (\`id\` varchar(36) NOT NULL, \`pool_ids\` text NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pools\` (\`id\` varchar(36) NOT NULL, \`address\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`base_token_price_usd\` decimal NULL, \`reserve_in_usd\` decimal NULL, \`dex\` varchar(255) NOT NULL, \`link\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`pools\``);
        await queryRunner.query(`DROP TABLE \`top_pools\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
