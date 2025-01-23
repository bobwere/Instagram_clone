import { OmitType } from '@nestjs/swagger';
import { compareHash } from '@/core/utils/hashing';
import { User } from '../../../../domain/user.entity';

class UserMock extends OmitType(User, [

] as const) {}

const constructMocks = (data: UserMock) => {
  return {
    ...data,
    hasValidPassword(password: string): boolean {
      return compareHash(password, this.password);
    },
  };
};

const data: UserMock[] = [
  {
    id: 'd4b1ba5e-8108-45c2-be25-68c5d94c66c8',
    createdAt: new Date('2023-10-25T14:30:18.419Z'),
    updatedAt: new Date('2024-02-07T11:40:20.201Z'),
    name: null,
    email: 'test1@gmail.com',
    password: '$2a$10$ZAj0ROk721nJ9ABPEvdoVOeUYbrmcnw08d/XB6D9pNckfeWI.2mJC',
  },
  {
    id: 'c4b1ba5e-8108-45c2-be25-68c5d94c66c7',
    createdAt: new Date('2023-10-25T14:30:18.419Z'),
    updatedAt: new Date('2024-02-07T11:40:20.201Z'),
    name: null,
    email: 'test2.am@gmail.com',
    password: '$2a$10$LMtgc.kZlt7nlcJAAcNTPOoFFsBmytmJklpajZCVrlSqjK3qwokBm',
  },
  {
    id: 'b4b1ba5e-8108-45c2-be25-68c5d94c66c6',
    createdAt: new Date('2023-10-25T14:30:18.419Z'),
    updatedAt: new Date('2024-02-07T11:40:20.201Z'),
    name: null,
    email: 'test3.am@gmail.com',
    password: '$2a$10$LMtgc.kZlt7nlcJAAcNTPOoFFsBmytmJklpajZCVrlSqjK3qwokBm',
  },
];

const userMocks = data.map(constructMocks);

export default userMocks;
