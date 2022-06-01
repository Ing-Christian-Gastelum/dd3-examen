import { GameToWord } from 'src/modules/games/entities/game-word.entity';
import { Game } from 'src/modules/games/entities/game.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';

@Entity('words')
export class Word extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    unique: true,
    nullable: true,
  })
  word: string;

  @OneToMany(() => GameToWord, (gameToWord) => gameToWord.word)
  @JoinTable()
  gameToWord: GameToWord[];
}
