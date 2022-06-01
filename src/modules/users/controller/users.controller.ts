import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  register(@Body() dto: CreateUserDto): Promise<{
    message: string;
    userId: string;
  }> {
    return this.usersService.register(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginDto): Promise<{
    message: string;
    token: string;
  }> {
    return this.usersService.login(dto);
  }
}
