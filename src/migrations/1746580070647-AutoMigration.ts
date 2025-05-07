import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1746580070647 implements MigrationInterface {
    name = 'AutoMigration1746580070647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "top_pools" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pool_ids" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_71c874c8d208f578a78ed2abeac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pools" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "name" character varying NOT NULL, "base_token_price_usd" numeric, "reserve_in_usd" numeric, "dex" character varying NOT NULL, "link" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP, CONSTRAINT "UQ_8f9d6a1e9ca7c169ba22b77d0ef" UNIQUE ("address"), CONSTRAINT "PK_6708c86fc389259de3ee43230ee" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pools"`);
        await queryRunner.query(`DROP TABLE "top_pools"`);
    }

}
