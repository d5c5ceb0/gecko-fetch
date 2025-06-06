import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1749118902862 implements MigrationInterface {
    name = 'AutoMigration1749118902862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_24519f1e09c4f3267401c2d7f4\` ON \`survey_question\``);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`surveyId\``);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD \`surveyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`questionId\``);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD \`questionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_question\` DROP COLUMN \`surveyId\``);
        await queryRunner.query(`ALTER TABLE \`survey_question\` ADD \`surveyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_question\` DROP COLUMN \`questionId\``);
        await queryRunner.query(`ALTER TABLE \`survey_question\` ADD \`questionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_07a57f5ed8a3c9c000a602ffc47\` FOREIGN KEY (\`surveyId\`) REFERENCES \`surveys\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_c38697a57844f52584abdb878d7\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`survey_question\` ADD CONSTRAINT \`FK_036a359b4a0884d113f6232e96d\` FOREIGN KEY (\`surveyId\`) REFERENCES \`surveys\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`survey_question\` ADD CONSTRAINT \`FK_b3f14c7ee973c3d12f6c9f888b5\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`survey_question\` DROP FOREIGN KEY \`FK_b3f14c7ee973c3d12f6c9f888b5\``);
        await queryRunner.query(`ALTER TABLE \`survey_question\` DROP FOREIGN KEY \`FK_036a359b4a0884d113f6232e96d\``);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_c38697a57844f52584abdb878d7\``);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_07a57f5ed8a3c9c000a602ffc47\``);
        await queryRunner.query(`ALTER TABLE \`survey_question\` DROP COLUMN \`questionId\``);
        await queryRunner.query(`ALTER TABLE \`survey_question\` ADD \`questionId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`survey_question\` DROP COLUMN \`surveyId\``);
        await queryRunner.query(`ALTER TABLE \`survey_question\` ADD \`surveyId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`questionId\``);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD \`questionId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`surveyId\``);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD \`surveyId\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_24519f1e09c4f3267401c2d7f4\` ON \`survey_question\` (\`surveyId\`, \`questionId\`)`);
    }

}
