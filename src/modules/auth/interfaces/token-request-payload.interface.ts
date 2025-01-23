import { User } from '@/domain/user.entity';

export interface TokenRequestPayload {
  user: User;

  token: string;
}
