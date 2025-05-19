import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747129254653 implements MigrationInterface {
    name = 'AutoMigration1747129254653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`twitter\` (\`id\` int NOT NULL AUTO_INCREMENT, \`account\` varchar(255) NOT NULL, \`uid\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b876260593f76d3b9fe9a046c2\` (\`account\`), UNIQUE INDEX \`IDX_a881e742c4ffb56621b37997aa\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_a881e742c4ffb56621b37997aa\` ON \`twitter\``);
        await queryRunner.query(`DROP INDEX \`IDX_b876260593f76d3b9fe9a046c2\` ON \`twitter\``);
        await queryRunner.query(`DROP TABLE \`twitter\``);
    }

}
