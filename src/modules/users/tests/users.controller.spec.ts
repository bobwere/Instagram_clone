import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { TestBed } from '@automock/jest';
import { User } from '../../../domain/user.entity';
import { UsersController } from '../users.controller';
import { des } from '@/core/utils/tests';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import userMocks from './mocks/users.mock';
import { UsersService } from '../users.service';

describe('UsersConttoller', () => {
  let usersController: UsersController;
  let userService: UsersService;
  let app: INestApplication<any>;
  let jwtService: JwtService;

  const testUser = userMocks[0];
  const jwtPayload: JwtPayload = {
    email: testUser.email,
    id: testUser.id,
  };

  beforeEach(async () => {
    const { unit, unitRef: _ } = TestBed.create(UsersService).compile();
    userService = unit;

    const envConfigs = {
      JWT_SECRET: 'some-secret',
      JWT_EXPIRES_IN: '1h',
    };

    const usersModule: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule.register({
          secret: envConfigs.JWT_SECRET,
          signOptions: { expiresIn: envConfigs.JWT_EXPIRES_IN },
        }),
      ],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return envConfigs[key];
            }),
          },
        },
        {
          provide: UsersService,
          useValue: userService,
        },
        {
          provide: APP_GUARD,
          useExisting: JwtAuthGuard,
        },
        JwtAuthGuard,
        JwtStrategy,
      ],
      controllers: [UsersController],
    }).compile();

    usersController = usersModule.get<UsersController>(UsersController);
    jwtService = usersModule.get<JwtService>(JwtService);
    // configService = usersModule.get<ConfigService>(ConfigService);

    app = usersModule.createNestApplication();

    // Cookie parser
    app.use(cookieParser('some-super-secret'));

    await app.init();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should have users service', () => {
    expect(userService).toBeDefined();
  });

  des({ url: '/users/current', method: 'GET' }, async (config) => {
    it('should fail if the user does not have jwt passed', async () => {
      jest.spyOn(userService, 'findById');

      const res = await request(app.getHttpServer()).get(config.url as string);

      const actualRes = res.body;

      expect(actualRes.statusCode).toBe(401);
      expect(actualRes.message).toBe('Unauthorized');
      expect(userService.findById).not.toHaveBeenCalled();
    });

    it('should fail if the JWT passed is invalid', async () => {
      jest.spyOn(userService, 'findById');

      const res = await request(app.getHttpServer())
        .get(config.url as string)
        .set('Authorization', 'Bearer invalid-token');

      const actualRes = res.body;

      expect(actualRes.statusCode).toBe(401);
      expect(actualRes.message).toBe('Unauthorized');
      expect(userService.findById).not.toHaveBeenCalled();
    });

    it('should throw error unauthorized if user in payload not found', async () => {
      const token = jwtService.sign(jwtPayload);
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      const res = await request(app.getHttpServer())
        .get(config.url as string)
        .set('Authorization', `Bearer ${token}`);

      const actualRes = res.body;

      expect(actualRes.statusCode).toBe(401);
      expect(actualRes.message).toBe('Invalid login credentials');
      expect(actualRes.error).toBe('Unauthorized');
      expect(userService.findById).toBeCalledWith(testUser.id);
    });

    it('should return the current logged in user', async () => {
      const token = jwtService.sign(jwtPayload);
      jest.spyOn(userService, 'findById').mockResolvedValue(testUser as User);

      const res = await request(app.getHttpServer())
        .get(config.url as string)
        .set('Authorization', `Bearer ${token}`);

      const actualRes = res.body;

      expect(res.statusCode).toBe(200);
      expect(actualRes.id).toEqual(testUser.id);
      expect(actualRes.email).toEqual(testUser.email);
      expect(userService.findById).toBeCalledWith(testUser.id);
    });
  });
});
