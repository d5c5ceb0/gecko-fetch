import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1749113807033 implements MigrationInterface {
    name = 'AutoMigration1749113807033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`survey_question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`surveyId\` varchar(255) NOT NULL, \`questionId\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_24519f1e09c4f3267401c2d7f4\` (\`surveyId\`, \`questionId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_24519f1e09c4f3267401c2d7f4\` ON \`survey_question\``);
        await queryRunner.query(`DROP TABLE \`survey_question\``);
    }

}
