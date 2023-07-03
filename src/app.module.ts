import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './api/user/user.module';
import { CrudModule } from './api/crud/crud.module';

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
    CrudModule,
    UserModule,

    // Api Routing
    RouterModule.register([{
      path: 'api',
      module: UserModule,
    }]),
    
  ],
  providers: [AppService],
})
export class AppModule {}
