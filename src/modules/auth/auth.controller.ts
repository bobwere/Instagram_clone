import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { Serialize } from '@/core/interceptor/serializer.interceptor';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../../domain/user.entity';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { AuthService } from './services/auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(User)
  @Post('/signup')
  signUp(@Body() newUserData: CreateUserDto): Promise<User> {
    return this.authService.signUp(newUserData);
  }

  @Serialize(SignInResponseDto)
  @Post('/signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() request: Request
  ): Promise<SignInResponseDto> {
    const signInRes = await this.authService.signIn(signInDto);

    request.res.cookie('refresh-token', signInRes.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      signed: true,
    });

    return signInRes;
  }

  @Post('/refresh-token')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Req() request: Request
  ): Promise<AuthTokensDto> {
    const tokens = await this.authService.refreshToken(user);
    request.res.cookie('refresh-token', tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      signed: true,
    });

    return tokens;
  }
}
