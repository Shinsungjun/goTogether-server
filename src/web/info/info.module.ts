import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewReportReason } from 'src/entity/reviewReportReason.entity';
import { UserDeleteReason } from 'src/entity/userDeleteReason.entity';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserDeleteReason, ReviewReportReason])],
  controllers: [InfoController],
  providers: [InfoService],
})
export class InfoModule {}
