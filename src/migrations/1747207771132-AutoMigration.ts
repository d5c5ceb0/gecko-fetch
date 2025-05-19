import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747207771132 implements MigrationInterface {
    name = 'AutoMigration1747207771132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`fetch\` (\`id\` int NOT NULL AUTO_INCREMENT, \`twitter_id\` varchar(255) NOT NULL, \`start_time\` datetime NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`content\` (\`id\` int NOT NULL AUTO_INCREMENT, \`twitter_id\` varchar(255) NOT NULL, \`tweet_id\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e31ce4202479748231e634974d\` (\`twitter_id\`), UNIQUE INDEX \`IDX_c1032140e73c6beae6ac7c999b\` (\`tweet_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_c1032140e73c6beae6ac7c999b\` ON \`content\``);
        await queryRunner.query(`DROP INDEX \`IDX_e31ce4202479748231e634974d\` ON \`content\``);
        await queryRunner.query(`DROP TABLE \`content\``);
        await queryRunner.query(`DROP TABLE \`fetch\``);
    }

}
