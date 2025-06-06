import { DataSource, DataSourceOptions } from 'typeorm';
import { AppointmentEntity } from './entities/AppointmentEntity';
import { CountryISO } from '../../domain/value-objects/CountryISO';

const configs: Record<CountryISO, DataSourceOptions> = {
  [CountryISO.PE]: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASS || 'pass',
    database: process.env.DB_NAME_PE || 'appointments_peru',
  },
  [CountryISO.CL]: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASS || 'pass',
    database: process.env.DB_NAME_CL || 'appointments_chile',
  },
};

export class DatabaseConnectionFactory {
  private static cache: Partial<Record<CountryISO, DataSource>> = {};

  public static async get(country: CountryISO): Promise<DataSource> {
    if (this.cache[country]?.isInitialized) {
      return this.cache[country];
    }

    const config = configs[country];
    const dataSource = new DataSource({
      ...config,
      entities: [AppointmentEntity],
      synchronize: false,
    });

    await dataSource.initialize();
    this.cache[country] = dataSource;

    return dataSource;
  }
}
