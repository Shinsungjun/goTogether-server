import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDeleteReason } from 'src/entity/userDeleteReason.entity';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserDeleteReason])],
  controllers: [InfoController],
  providers: [InfoService],
})
export class InfoModule {}
