import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as readLine from 'readline';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '../entities/word.entity';

@Injectable()
export class WordsService implements OnModuleInit {
  private readonly logger = new Logger(WordsService.name);
  constructor(
    @InjectRepository(Word)
    private wordEntity: Repository<Word>,
  ) {}

  onModuleInit() {
    this.logger.log('Inicializando importación de Palabras ');
    const file = 'words.txt';
    const words = [];
    const rl = readLine.createInterface({
      input: fs.createReadStream(file),
      output: process.stdout,
      terminal: false,
    });
    rl.on('line', async (text) => {
      if (text.length == 5) {
        words.push(text);
      }
    });
    rl.on('close', async () => {
      for (const word of words) {
        const parseWord = this.removeAccents(word);
        const findWord = await this.wordEntity.findOne({ word: parseWord });
        if (findWord === undefined) {
          await this.wordEntity.save({
            word: parseWord,
          });
        }
      }
      this.logger.log('Finalizado importación Palabras');
    });
  }
  removeAccents(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }
}
