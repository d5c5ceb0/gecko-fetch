import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747548279041 implements MigrationInterface {
    name = 'AutoMigration1747548279041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`subscriptions\` (\`id\` varchar(36) NOT NULL, \`bot_name\` varchar(255) NOT NULL, \`telegram_id\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6b0fc5909f8de65c3b8dc6df12\` (\`bot_name\`, \`telegram_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6b0fc5909f8de65c3b8dc6df12\` ON \`subscriptions\``);
        await queryRunner.query(`DROP TABLE \`subscriptions\``);
    }

}
