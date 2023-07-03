import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './api/providers/user/user.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config';
import { ApiModule } from './api/api.module';
import { RouterModule } from '@nestjs/core';
import { RepositoryModule } from './models/model.module';
import { UserRepository } from './models/repository';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // Database
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get<TypeOrmModuleOptions>('db'),
      }),
      inject: [ConfigService],
    }),
    // Api
    ApiModule,

    // Api Routing
    RouterModule.register([{
      path: 'api',
      module: ApiModule,
    }]),
    
  ],
  providers: [AppService],
})
export class AppModule {}
