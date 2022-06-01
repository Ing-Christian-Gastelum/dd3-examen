import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { Word } from '../words/entities/word.entity';
import { GamesController } from './controller/games.controller';
import { GameToWord } from './entities/game-word.entity';
import { Game } from './entities/game.entity';
import { GamesService } from './service/games.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Game, Word, GameToWord])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
