import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRefIdMigration1737652938134 implements MigrationInterface {
    name = 'RemoveRefIdMigration1737652938134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "reference_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "reference_id" uuid NOT NULL`);
    }
}
