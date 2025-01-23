import { IS_PUBLIC_KEY } from '@/core/shared/enums/public';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
