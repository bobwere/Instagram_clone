import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Repository } from 'typeorm';
import { TestBed } from '@automock/jest';
import { User } from '../../../domain/user.entity';
import { UsersService } from '../users.service';
import { formatEmail } from '@/core/utils/formatting-data';
import { getRepositoryToken } from '@nestjs/typeorm';
import userMocks from './mocks/users.mock';

jest.mock('@/utils/formatting-data', () => ({
  formatEmail: jest.fn().mockImplementation((email: string) => email),
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const { unit, unitRef } =
      TestBed.create<UsersService>(UsersService).compile();

    usersService = unit;
    userRepository = unitRef.get(getRepositoryToken(User) as string);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    const newUserData: CreateUserDto = {
      email: 'test1@gmail.com',
      password: 'password',
      name: 'John',
    };

    it('should not create user if a user with email exists', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(userMocks[0] as User);
      jest.spyOn(usersService, 'createUser');

      const createUserPromise = usersService.createUser(
        newUserData,

      );

      expect(createUserPromise).rejects.toThrowError(
        new ConflictException('Please use a different email address.')
      );
      expect(usersService.createUser).toHaveBeenCalledWith(
        newUserData,
      );
      expect(formatEmail).toHaveBeenCalled();
      expect(usersService.findByEmail).toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should create user if details are valid', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'createUser');

      userRepository.create.mockReturnValueOnce(userMocks[0] as User);

      const createdUser = await usersService.createUser(
        newUserData,
      );

      expect(formatEmail).toHaveBeenCalled();
      expect(usersService.createUser).toHaveBeenCalledWith(
        newUserData,
      );
      expect(usersService.findByEmail).toHaveBeenCalled();
      expect(createdUser).toEqual(userMocks[0]);
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    const testEmail = 'some-email@gmail.com';

    it('should return null if email is empty', async () => {
      const foundUser = await usersService.findByEmail('');

      expect(foundUser).toBeNull();
      expect(formatEmail).toHaveBeenCalled();
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return null if user is not found', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);

      const foundUser = await usersService.findByEmail(testEmail);

      expect(foundUser).toBeNull();
      expect(formatEmail).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalled();
    });

    it('should return user if valid email provided', async () => {
      const expectedUser = {
        ...userMocks[0],
        email: testEmail,
      };

      userRepository.findOne.mockResolvedValueOnce(expectedUser as User);

      const foundUser = await usersService.findByEmail(testEmail);

      expect(foundUser).toEqual(expectedUser);
      expect(formatEmail).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    const testId = userMocks[0].id;

    it('should return null if id is invalid', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);

      const foundUser = await usersService.findById(testId);

      expect(foundUser).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalled();
    });

    it('should return user if id is valid', async () => {
      userRepository.findOne.mockResolvedValueOnce(userMocks[0] as User);
      const foundUser = await usersService.findById(testId);

      expect(foundUser).toBe(userMocks[0]);
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });
});
