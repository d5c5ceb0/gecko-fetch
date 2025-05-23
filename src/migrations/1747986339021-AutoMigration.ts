import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747986339021 implements MigrationInterface {
    name = 'AutoMigration1747986339021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chatId\` varchar(255) NOT NULL, \`botName\` varchar(255) NOT NULL, \`surveyId\` varchar(255) NOT NULL, \`questionId\` varchar(255) NOT NULL, \`answer\` text NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`answers\``);
    }

}
