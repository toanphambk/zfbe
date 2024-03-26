import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModrecordEnt1710493418680 implements MigrationInterface {
  name = 'ModrecordEnt1710493418680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "record" ADD COLUMN "result" integer NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "result"`);
  }
}
