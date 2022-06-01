import { Users } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Entity,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { GameToWord } from './game-word.entity';

@Entity('games')
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  score: number;

  @ManyToOne(() => Users, (users) => users.game)
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column({
    nullable: true,
  })
  userId: string;

  @OneToMany(() => GameToWord, (gameToWord) => gameToWord.game)
  @JoinTable()
  gameToWord: GameToWord[];
}
