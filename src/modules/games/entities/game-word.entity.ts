import { Word } from 'src/modules/words/entities/word.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  JoinTable,
} from 'typeorm';
import { Game } from './game.entity';

@Entity('game-word')
export class GameToWord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
    default: 0,
  })
  attempt: number;

  @Column({
    nullable: true,
    default: false,
  })
  complete: boolean;

  @ManyToOne(() => Word, (word) => word.gameToWord)
  @JoinTable({ name: 'wordId' })
  public word!: Word;
  @Column({
    nullable: true,
  })
  wordId: number;

  @ManyToOne(() => Game, (game) => game.gameToWord)
  @JoinTable({ name: 'gameId' })
  public game!: Game;
  @Column({
    nullable: true,
  })
  gameId: string;
}
