import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../dto/create-user.dto';
import { Users } from '../entities/user.entity';
import { LoginDto } from '../dto/login';
import { Game } from 'src/modules/games/entities/game.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userEntity: Repository<Users>,
    @InjectRepository(Game) private gameEntity: Repository<Game>,

    private jwtService: JwtService,
  ) {}

  async register(
    data: CreateUserDto,
  ): Promise<{ message: string; userId: string }> {
    const { username, password } = data;
    const userSearch = await this.userEntity.findOne({
      where: { username },
    });
    if (userSearch)
      throw new HttpException(
        'User ya se encuentra registrado.',
        HttpStatus.BAD_REQUEST,
      );
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const user = await this.userEntity
      .save({
        username,
        password: hash,
      })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    return { message: 'El Usuario fue registrado.', userId: user.id };
  }
  async login(data: LoginDto): Promise<{ message: string; token: string }> {
    const { username, password } = data;

    const user = await this.userEntity.findOne({
      where: [{ username }],
    });
    if (!user)
      throw new HttpException('usuario no registrado', HttpStatus.NOT_FOUND);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new HttpException(
        'usuario o contraseña invalidos.',
        HttpStatus.UNAUTHORIZED,
      );
    const foundGame = await this.gameEntity.findOne({
      where: [{ userId: user.id }],
    });
    let game;
    if (foundGame !== undefined) {
      game = foundGame;
    } else {
      game = await this.gameEntity.save({ user: user });
    }

    const payload = {
      id: user.id,
      username: user.username,
      gameId: game.id,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });

    user.lastConnection = new Date();
    await user.save();

    return {
      message: 'El Usuario ha iniciado sesión con éxito.',
      token: token,
    };
  }

  async validateUserToken(userId: string) {
    const user = await this.userEntity.findOne({ where: { id: userId } });
    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    return user;
  }
}
