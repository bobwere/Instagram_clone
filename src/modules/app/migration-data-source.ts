import * as dotenv from 'dotenv';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

const dotenvPath = path.resolve(process.cwd(), `.env`);
const result = dotenv.config({ path: dotenvPath });
if (result.error) {
  /* do nothing */
}

const extraOption =
  process.env.NODE_ENV === 'production'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {};

export const migrtionDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_MIGRATION_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*_migration.js'],
  synchronize: false,
  migrationsRun: false,
  extra: extraOption,
};

const migrtionDataSource = new DataSource(migrtionDataSourceOptions);

export default migrtionDataSource;
