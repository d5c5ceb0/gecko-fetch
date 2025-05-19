import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747215992202 implements MigrationInterface {
    name = 'AutoMigration1747215992202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`meme\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tweet_id\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b1829872fa4bfeea48f4071236\` (\`tweet_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b1829872fa4bfeea48f4071236\` ON \`meme\``);
        await queryRunner.query(`DROP TABLE \`meme\``);
    }

}
