import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747209525093 implements MigrationInterface {
    name = 'AutoMigration1747209525093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e31ce4202479748231e634974d\` ON \`content\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e31ce4202479748231e634974d\` ON \`content\` (\`twitter_id\`)`);
    }

}
