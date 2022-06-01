import { Game } from 'src/modules/games/entities/game.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class Users extends BaseEntity {
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
  })
  lastConnection: Date;

  @Column({
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  password: string;

  @OneToMany(() => Game, (game) => game.user)
  public game: Game[];
}
