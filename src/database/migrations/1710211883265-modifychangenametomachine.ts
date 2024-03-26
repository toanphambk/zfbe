import { MigrationInterface, QueryRunner } from 'typeorm';

export class Modifychangenametomachine1710211883265
  implements MigrationInterface
{
  name = 'Modifychangenametomachine1710211883265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "hash" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "photoId" uuid, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e282acb94d2e3aec10f480e4f6" ON "user" ("hash") `,
    );
    await queryRunner.query(
      `CREATE TABLE "forgot" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_087959f5bb89da4ce3d763eab75" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df507d27b0fb20cd5f7bef9b9a" ON "forgot" ("hash") `,
    );
    await queryRunner.query(
      `CREATE TABLE "shift" ("id" SERIAL NOT NULL, "shiftName" character varying NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "machineId" integer, CONSTRAINT "PK_53071a6485a1e9dc75ec3db54b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "qrcode" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "machineId" integer, CONSTRAINT "PK_9aaafe9e77dce17001051dab68a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfid" ("id" SERIAL NOT NULL, "rfidTag" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "machineId" integer, CONSTRAINT "PK_e876a8050948eaa61080db68ebc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "machine" ("id" SERIAL NOT NULL, "SystemID" character varying NOT NULL, "LineID" character varying NOT NULL, "StationName" character varying NOT NULL, "StationID" character varying NOT NULL, "description" character varying NOT NULL, "ipAddress" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_acc588900ffa841d96eb5fd566c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "machine_event" ("id" SERIAL NOT NULL, "eventName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "machineId" integer, CONSTRAINT "PK_8b281dc95071ac8f5a07f9fb3c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forgot" ADD CONSTRAINT "FK_31f3c80de0525250f31e23a9b83" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shift" ADD CONSTRAINT "FK_2688376c56032f2453028ef1921" FOREIGN KEY ("machineId") REFERENCES "machine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "qrcode" ADD CONSTRAINT "FK_520649fe1c3db37b3cb2e1f5313" FOREIGN KEY ("machineId") REFERENCES "machine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfid" ADD CONSTRAINT "FK_6c95c824d0f03da4279fdfd7c4e" FOREIGN KEY ("machineId") REFERENCES "machine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "machine_event" ADD CONSTRAINT "FK_5d47bb691c28415a3223331d415" FOREIGN KEY ("machineId") REFERENCES "machine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "machine_event" DROP CONSTRAINT "FK_5d47bb691c28415a3223331d415"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfid" DROP CONSTRAINT "FK_6c95c824d0f03da4279fdfd7c4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "qrcode" DROP CONSTRAINT "FK_520649fe1c3db37b3cb2e1f5313"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shift" DROP CONSTRAINT "FK_2688376c56032f2453028ef1921"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forgot" DROP CONSTRAINT "FK_31f3c80de0525250f31e23a9b83"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(`DROP TABLE "machine_event"`);
    await queryRunner.query(`DROP TABLE "machine"`);
    await queryRunner.query(`DROP TABLE "rfid"`);
    await queryRunner.query(`DROP TABLE "qrcode"`);
    await queryRunner.query(`DROP TABLE "shift"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df507d27b0fb20cd5f7bef9b9a"`,
    );
    await queryRunner.query(`DROP TABLE "forgot"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e282acb94d2e3aec10f480e4f6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
