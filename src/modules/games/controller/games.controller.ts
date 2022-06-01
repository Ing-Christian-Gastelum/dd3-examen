import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/authUser';
import { PostWordDto } from '../dto/postWord.dto';
import { GamesService } from '../service/games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getWord(@Request() req: any) {
    return this.gamesService.getWord(req.user);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  postWord(@Request() req: any, @Body() data: PostWordDto) {
    return this.gamesService.postWord(req.user, data);
  }

  @Get('/status')
  @UseGuards(JwtAuthGuard)
  getStatusPlayer(@Request() req: any) {
    return this.gamesService.getStatusPlayer(req.user);
  }

  @Get('/topten')
  @UseGuards(JwtAuthGuard)
  getTopTenPlayers() {
    return this.gamesService.getTopTenPlayers();
  }
  @Get('/wordCorrect')
  @UseGuards(JwtAuthGuard)
  getWordsCorrect() {
    return this.gamesService.getWordsCorrect();
  }
}
