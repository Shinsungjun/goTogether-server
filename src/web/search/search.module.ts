import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchQuery } from './search.query';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, SearchQuery],
})
export class SearchModule {}
