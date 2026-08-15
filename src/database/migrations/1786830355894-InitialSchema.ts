import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1786830355894 implements MigrationInterface {
    name = 'InitialSchema1786830355894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookmakers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "name" character varying NOT NULL, "logoUrl" character varying, "affiliateUrl" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3e979e9f0551ab6f938969612fd" UNIQUE ("slug"), CONSTRAINT "PK_f75b6ecebd5c6a9df57492e0b3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."odds_market_enum" AS ENUM('MATCH_RESULT')`);
        await queryRunner.query(`CREATE TYPE "public"."odds_selection_enum" AS ENUM('HOME', 'DRAW', 'AWAY')`);
        await queryRunner.query(`CREATE TABLE "odds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gameId" uuid NOT NULL, "bookmakerId" uuid NOT NULL, "market" "public"."odds_market_enum" NOT NULL, "selection" "public"."odds_selection_enum" NOT NULL, "value" numeric(6,2) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_697d4239339fed10db401b509d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_31cf52b8d67ba6355706a0c87d" ON "odds"  ("gameId", "bookmakerId", "market", "selection") `);
        await queryRunner.query(`CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "homeTeam" character varying NOT NULL, "awayTeam" character varying NOT NULL, "league" character varying NOT NULL, "startTime" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."alerts_market_enum" AS ENUM('MATCH_RESULT')`);
        await queryRunner.query(`CREATE TYPE "public"."alerts_selection_enum" AS ENUM('HOME', 'DRAW', 'AWAY')`);
        await queryRunner.query(`CREATE TYPE "public"."alerts_status_enum" AS ENUM('ativo', 'disparado', 'cancelado')`);
        await queryRunner.query(`CREATE TABLE "alerts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gameId" uuid NOT NULL, "market" "public"."alerts_market_enum" NOT NULL, "selection" "public"."alerts_selection_enum" NOT NULL, "targetOdd" numeric(6,2) NOT NULL, "status" "public"."alerts_status_enum" NOT NULL DEFAULT 'ativo', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "triggeredAt" TIMESTAMP WITH TIME ZONE, "triggeredBookmakerId" uuid, CONSTRAINT "PK_60f895662df096bfcdfab7f4b96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "odds" ADD CONSTRAINT "FK_878909370762435411260db658d" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "odds" ADD CONSTRAINT "FK_80e2ab9ad2e0ce818c14c8df9b9" FOREIGN KEY ("bookmakerId") REFERENCES "bookmakers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD CONSTRAINT "FK_1071855291c8dc01aa15f457b7a" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD CONSTRAINT "FK_05ce7a27dc7007d57454f736e41" FOREIGN KEY ("triggeredBookmakerId") REFERENCES "bookmakers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP CONSTRAINT "FK_05ce7a27dc7007d57454f736e41"`);
        await queryRunner.query(`ALTER TABLE "alerts" DROP CONSTRAINT "FK_1071855291c8dc01aa15f457b7a"`);
        await queryRunner.query(`ALTER TABLE "odds" DROP CONSTRAINT "FK_80e2ab9ad2e0ce818c14c8df9b9"`);
        await queryRunner.query(`ALTER TABLE "odds" DROP CONSTRAINT "FK_878909370762435411260db658d"`);
        await queryRunner.query(`DROP TABLE "alerts"`);
        await queryRunner.query(`DROP TYPE "public"."alerts_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."alerts_selection_enum"`);
        await queryRunner.query(`DROP TYPE "public"."alerts_market_enum"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31cf52b8d67ba6355706a0c87d"`);
        await queryRunner.query(`DROP TABLE "odds"`);
        await queryRunner.query(`DROP TYPE "public"."odds_selection_enum"`);
        await queryRunner.query(`DROP TYPE "public"."odds_market_enum"`);
        await queryRunner.query(`DROP TABLE "bookmakers"`);
    }

}
