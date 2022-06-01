import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UsersService } from './service/users.service';
import { Users } from './entities/user.entity';
import { UsersController } from './controller/users.controller';
import { Game } from '../games/entities/game.entity';
import { JwtStrategy } from 'src/jwt/jwtStrategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Game]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {}
