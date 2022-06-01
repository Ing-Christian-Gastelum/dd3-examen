import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Word } from './entities/word.entity';
import { WordsService } from './service/words.service';

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  providers: [WordsService],
})
export class WordsModule {}
