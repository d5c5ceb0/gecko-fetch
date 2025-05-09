import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746772197134 implements MigrationInterface {
    name = 'AutoMigration1746772197134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_ae225958fa9a3b0d0db260af0d\` ON \`smart_address\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_ae225958fa9a3b0d0db260af0d\` ON \`smart_address\` (\`address\`)`);
    }

}
