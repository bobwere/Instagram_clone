import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { dataSourceOptions } from './data-source';


dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  ...dataSourceOptions,
  seedTracking: false,
  factories: [],
  seeds: [],
};

const seedDataSource = new DataSource(options);

(async () => {
  await seedDataSource.initialize();
  await runSeeders(seedDataSource);
  await seedDataSource.destroy();
})();

export default seedDataSource;
