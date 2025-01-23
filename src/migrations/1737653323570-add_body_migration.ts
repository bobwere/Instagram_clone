import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBodyMigration1737653323570 implements MigrationInterface {
    name = 'AddBodyMigration1737653323570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "content" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "content"`);
    }

}
