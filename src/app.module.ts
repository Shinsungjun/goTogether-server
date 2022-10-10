import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './web/auth/auth.module';
import { UserModule } from './web/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'jj-database.cyix6flvbh8e.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'jjjj1234',
      database: 'jj-dev-db',
      entities: ['dist/src/**/*.entity{.ts,.js}'],
      synchronize: false,
      bigNumberStrings: false,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
