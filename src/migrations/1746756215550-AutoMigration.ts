import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746756215550 implements MigrationInterface {
    name = 'AutoMigration1746756215550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`smart_address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`address\` varchar(255) NOT NULL, \`owner\` varchar(255) NOT NULL, \`lastBalance\` decimal NOT NULL DEFAULT '0', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ae225958fa9a3b0d0db260af0d\` (\`address\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_ae225958fa9a3b0d0db260af0d\` ON \`smart_address\``);
        await queryRunner.query(`DROP TABLE \`smart_address\``);
    }

}
