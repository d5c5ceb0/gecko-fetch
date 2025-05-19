import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747207994784 implements MigrationInterface {
    name = 'AutoMigration1747207994784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`fetch_date\` (\`id\` int NOT NULL AUTO_INCREMENT, \`twitter_id\` varchar(255) NOT NULL, \`start_time\` datetime NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`fetch_date\``);
    }

}
