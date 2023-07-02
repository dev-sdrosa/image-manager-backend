// import { DataSource, DataSourceOptions } from "typeorm";
// import * as dotenv from 'dotenv';

// dotenv.config();

// export const dataSourceOptions: DataSourceOptions = {
//     type: 'postgres',
//     logging: true,
//     host: process.env.DB_HOST || '127.0.0.1',
//     port: Number(process.env.DB_PORT) || 3306,
//     username: process.env.DB_USER || 'username',
//     password: process.env.DB_PASSWORD || 'password',
//     database: process.env.DB_NAME || 'dbname',
//     extra: {
//       connectionLimit: 10,
//     },
//     entities: [`dist/**/*.entity.{js,ts}`],
//     migrations: [`dist/db/migrations/*.{js,ts}`],
// }

// const dataSource = new DataSource(dataSourceOptions);

// export default dataSource

/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="../typing/global" />
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { configuration } from '../src/config';

dotenv.config();
const ormconfig = async (): Promise<DataSource> => {
  const config = <{ db: DataSourceOptions }> await configuration();

  return new DataSource({
    ...config.db,
    entities: [`${__dirname}/../src/models/entity/**/*.{js,ts}`],
    migrations: [`${__dirname}/../src/migration/**/*.{js,ts}`],
  });
};

// eslint-disable-next-line import/no-default-export
export default ormconfig();
