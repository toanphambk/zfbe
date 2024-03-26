import { MigrationInterface, QueryRunner } from 'typeorm';

export class Modifydata1710231046690 implements MigrationInterface {
  name = 'Modifydata1710231046690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "record_data" ("id" SERIAL NOT NULL, "OPID" character varying NOT NULL, "CurDta_QD01" integer NOT NULL, "CurDta_QD02" integer NOT NULL, "CurDta_QD03" integer NOT NULL, "CurDta_QD04" integer NOT NULL, "PrvDta1_QD01" integer NOT NULL, "PrvDta1_QD02" integer NOT NULL, "PrvDta1_QD03" integer NOT NULL, "PrvDta1_QD04" integer NOT NULL, "PrvDta2_QD01" integer NOT NULL, "PrvDta2_QD02" integer NOT NULL, "PrvDta2_QD03" integer NOT NULL, "PrvDta2_QD04" integer NOT NULL, "TryCnt" integer NOT NULL, "RT" integer NOT NULL, "OType" integer NOT NULL, "QD01_Min" integer NOT NULL, "QD01_Max" integer NOT NULL, "QD02_Min" integer NOT NULL, "QD02_Max" integer NOT NULL, "QD03_Min" integer NOT NULL, "QD03_Max" integer NOT NULL, "QD04_Min" integer NOT NULL, "QD04_Max" integer NOT NULL, "OperatorName" character varying NOT NULL, "OPTxt" character varying NOT NULL, "recordId" integer, CONSTRAINT "PK_5560ef111a0b035fbab7963eb9b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "record" ("id" SERIAL NOT NULL, "moduleSerialNo" character varying NOT NULL, "systemDt" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "machineId" integer, CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "record_data" ADD CONSTRAINT "FK_bd68d5be37ef620b846c83a2003" FOREIGN KEY ("recordId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" ADD CONSTRAINT "FK_dcde37b59b7cc55008be82374bb" FOREIGN KEY ("machineId") REFERENCES "machine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "record" DROP CONSTRAINT "FK_dcde37b59b7cc55008be82374bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record_data" DROP CONSTRAINT "FK_bd68d5be37ef620b846c83a2003"`,
    );
    await queryRunner.query(`DROP TABLE "record"`);
    await queryRunner.query(`DROP TABLE "record_data"`);
  }
}
