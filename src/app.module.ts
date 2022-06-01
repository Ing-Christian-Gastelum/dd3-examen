import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configService } from './config/config.service';
import { UsersModule } from './modules/users/users.module';
import { GamesModule } from './modules/games/games.module';
import { WordsModule } from './modules/words/words.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    GamesModule,
    WordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
