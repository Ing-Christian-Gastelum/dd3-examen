import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { Users } from 'src/modules/users/entities/user.entity';
import { Word } from 'src/modules/words/entities/word.entity';
import { Repository } from 'typeorm';
import { GameToWord } from '../entities/game-word.entity';
import { Game } from '../entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Users) private userEntity: Repository<Users>,
    @InjectRepository(Game) private gameEntity: Repository<Game>,
    @InjectRepository(Word) private WordEntity: Repository<Word>,
    @InjectRepository(GameToWord)
    private gameToWordEntity: Repository<GameToWord>,
  ) {}

  async getWord(req) {
    const { gameId } = req;
    const gameFound = await this.gameEntity.findOne(gameId);
    const countWords = await this.WordEntity.count();
    const wordsFount = await this.gameToWordEntity.find({
      where: [
        {
          gameId,
        },
      ],
    });
    const idRandom = await this.findWord(wordsFount, countWords);
    const wordFound = await this.WordEntity.findOne(idRandom);

    await this.gameToWordEntity.save({
      word: wordFound,
      game: gameFound,
    });
    const response = { word: wordFound?.word, attempt: 0 };
    return { response };
  }

  async postWord(req, data) {
    const { gameId } = req;
    const { user_word } = data;
    const query = await this.gameToWordEntity
      .createQueryBuilder('game-word')
      .innerJoinAndSelect('game-word.word', 'word')
      .innerJoinAndSelect('game-word.game', 'game')
      .where('game-word.complete = false and game-word.gameId = :gameId', {
        gameId,
      })
      .orderBy('game-word.createdAt', 'DESC')
      .getOne();
    if (query) {
      const wordSelect = query?.word?.word;
      if (query?.attempt === 5) {
        throw new ConflictException({
          message: 'El limite es 5 intentos.',
        });
      }
      if (wordSelect === user_word) {
        await this.gameToWordEntity
          .createQueryBuilder()
          .update('game-word')
          .set({ attempt: query?.attempt + 1, complete: true })
          .where('id = :id', { id: query?.id })
          .execute();
        await this.gameEntity
          .createQueryBuilder()
          .update('games')
          .set({ score: query?.game?.score + 100 - (query?.attempt + 1) })
          .where('id = :id', { id: query?.gameId })
          .execute();
        return { response: compareWords(wordSelect, user_word) };
      }
      const response = compareWords(wordSelect, user_word);
      await this.gameToWordEntity
        .createQueryBuilder()
        .update('game-word')
        .set({ attempt: query?.attempt + 1 })
        .where('id = :id', { id: query?.id })
        .execute();
      return { response };
    }
    throw new ConflictException({
      message: 'No tiene palabra asignada.',
    });
  }

  async getStatusPlayer(req) {
    const { gameId } = req;
    const query = await this.gameToWordEntity
      .createQueryBuilder('game-word')
      .select('game-word.complete as play,COUNT(game-word.word) AS count')
      .where('game-word.gameId = :gameId', { gameId })
      .groupBy('game-word.complete')
      .getRawMany();
    const response = { game: 0, win: 0 };
    if (query) {
      query.forEach((game) => {
        response.game += parseFloat(game.count);
        if (game.play) response.win = parseFloat(game.count);
      });
    }
    return { response };
  }
  async getTopTenPlayers() {
    const top = await this.gameEntity.find({
      relations: ['user'],
      take: 10,
      skip: 0,
      order: {
        score: 'DESC',
      },
    });
    const reponse = top.map(({ user, score }) => {
      return { player: user.username, score };
    });

    return { reponse };
  }

  async getWordsCorrect() {
    const query = await this.gameToWordEntity
      .createQueryBuilder('game-word')
      .innerJoinAndSelect('game-word.word', 'word')
      .select('word.word,COUNT(game-word.word) AS count')
      .where('game-word.complete = true')
      .groupBy('word.word')
      .getRawMany();
    return { response: query };
  }

  private async findWord(
    wordsFount: GameToWord[],
    countRow: number,
  ): Promise<number> {
    let idWord;
    do {
      idWord = getRandomInt(countRow);
    } while (wordsFount.find((element) => element.wordId === idWord));
    return idWord;
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function compareWords(wordSelect: string, user_word: string) {
  const response = [];
  for (let i = 0; i < 5; i++) {
    if (wordSelect[i] === user_word[i]) {
      response.push({
        letter: user_word[i],
        value: 1,
      });
    } else if (wordSelect.search(user_word[i]) == -1) {
      response.push({
        letter: user_word[i],
        value: 3,
      });
    } else if (wordSelect.search(user_word[i]) != 0) {
      response.push({
        letter: user_word[i],
        value: 2,
      });
    }
  }
  return response;
}
