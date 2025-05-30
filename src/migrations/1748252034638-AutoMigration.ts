import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1748252034638 implements MigrationInterface {
    name = 'AutoMigration1748252034638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`kol_tweet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`user_name\` varchar(255) NOT NULL, \`tweet_id\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`published_at\` timestamp NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5e29464e48027f9fca225ef502\` (\`tweet_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`kol_fetch_date\` (\`id\` int NOT NULL AUTO_INCREMENT, \`twitter_id\` varchar(255) NOT NULL, \`start_time\` datetime NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`kol_fetch_date\``);
        await queryRunner.query(`DROP INDEX \`IDX_5e29464e48027f9fca225ef502\` ON \`kol_tweet\``);
        await queryRunner.query(`DROP TABLE \`kol_tweet\``);
    }

}
