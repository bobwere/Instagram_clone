var bcrypt = require('bcryptjs');

import { AuthTokensDto } from '../dto/auth-tokens.dto';
import {
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/sign-in.dto';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { UsersService } from '../../users/users.service';
import { User } from '../../../domain/user.entity';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { NormalException } from '@/core/exception/normal.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signUp(newUserData: CreateUserDto): Promise<User> {
    console.log('newUserData',newUserData);

    const user = await this.usersService.createUser(
      newUserData,
    );

    return user;
  }


  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { password, email } = signInDto;

    await this.validate(email, password);

    const foundUser = await this.usersService.findByEmail(email);

    const { id } = foundUser;

    const payload: JwtPayload = {
      email: foundUser.email,
      id,
    };

    const jwtTokens = this.generateJwtTokens(payload);

    return {
      user: foundUser,
      ...jwtTokens,
    };
  }

  async validate(email: string, password: string): Promise<User> | null {
    const user = await this.usersService.findByEmail(email);

    if (user === null) {
      const err =
        'Email and password combination is wrong';
      throw NormalException.VALIDATION_ISSUE(err);
    }

    const passwordIsValid = await bcrypt.compareSync(password, user.password);

    if (passwordIsValid === false) {
      const err = 'Email and password combination is wrong';
      throw NormalException.VALIDATION_ISSUE(err);
    }

    return passwordIsValid ? user : null;
  }

  generateJwtTokens(payload: JwtPayload): AuthTokensDto {
    const accessToken: string = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    const refreshToken: string = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(user: User): Promise<AuthTokensDto> {
    const { email, id } = user;

    const payload: JwtPayload = {
      email,
      id,
    };

    return this.generateJwtTokens(payload);
  }
}
