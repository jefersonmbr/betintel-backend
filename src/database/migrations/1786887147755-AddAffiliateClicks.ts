import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAffiliateClicks1786887147755 implements MigrationInterface {
  name = 'AddAffiliateClicks1786887147755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "affiliate_clicks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookmakerId" uuid NOT NULL, "gameId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_15da15bc7ff917601a3372e5af7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "FK_d85c34b6fefff5f56f8ba762260" FOREIGN KEY ("bookmakerId") REFERENCES "bookmakers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "FK_a693a4ce30663510350f292b921" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate_clicks" DROP CONSTRAINT "FK_a693a4ce30663510350f292b921"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_clicks" DROP CONSTRAINT "FK_d85c34b6fefff5f56f8ba762260"`,
    );
    await queryRunner.query(`DROP TABLE "affiliate_clicks"`);
  }
}
