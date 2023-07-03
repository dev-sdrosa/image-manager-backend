import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { UserModule } from './api/user/user.module';
import { CrudModule } from './api/crud/crud.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './api/auth/auth.module';
import { JwtModule } from './api/jwt/jwt.module';
import { MailerModule } from './api/mailer/mailer.module';
import { AuthGuard } from './api/auth/guards/auth.guard';
import { ImageModule } from './api/image/image.module';

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

    // Global Module
    CommonModule,

    // Api Modules
    CrudModule,
    UserModule,
    JwtModule,
    MailerModule,
    ImageModule,
    AuthModule,
    
    // Api Routing

    RouterModule.register([{
      path: 'api',
      module: UserModule,
    },
    {
      path: 'api',
      module: AuthModule,
    },
    {
      path: 'api',
      module: ImageModule,
    }]),
    
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
