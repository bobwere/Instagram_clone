import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { User } from '../../../domain/user.entity';

export const USERS_PAGINATION_CONFIG: PaginateConfig<User> = {
  maxLimit: 20,
  withDeleted: false, // don't include deleted users, ie. those with deletedAt column set
  sortableColumns: [
    'id',
    'name',
    'email',
    'createdAt',
    'updatedAt',
  ],
  nullSort: 'last',
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['name', 'email', 'id'],
  select: [
    'id',
    'name',
    'email',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    id: [FilterOperator.EQ],
    name: [FilterOperator.ILIKE, FilterOperator.EQ],
    email: [FilterOperator.ILIKE, FilterOperator.EQ],
    createdAt: [FilterOperator.GT, FilterOperator.LT],
    updatedAt: [FilterOperator.GT, FilterOperator.LT],
  },
};
