import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Pagination } from '../enums/pagination';
import {
  PaginateConfig,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';

abstract class BaseServiceMethods<EntityModel> {
  EntityModelName: string;

  constructor(private readonly entityRepository: Repository<EntityModel>) {
    this.EntityModelName = entityRepository.metadata.name;
  }

  public getRepository(): Repository<EntityModel> {
    return this.entityRepository;
  }

  /* ***************************************************** */
  /* ******************** PROTECTED METHODS ************** */
  /* ***************************************************** */
  protected async create(createDto): Promise<EntityModel> {
    const newEntity = <EntityModel>this.entityRepository.create(createDto);
    return this.entityRepository.save(newEntity);
  }

  protected async remove(
    id: string,
    otherFilters: FindOptionsWhere<EntityModel> = {}
  ): Promise<EntityModel> {
    const foundEntity = await this.findOne({ id, ...otherFilters });

    if (!foundEntity) {
      throw new NotFoundException(`${this.EntityModelName} not found`);
    }

    return this.entityRepository.remove(foundEntity);
  }

  async paginatedFindAll(
    query: PaginateQuery,
    paginationConfig: PaginateConfig<EntityModel>
  ): Promise<Paginated<EntityModel>> {
    return paginate(query, this.entityRepository, paginationConfig);
  }

  async findAll(
    filters: FindOptionsWhere<EntityModel> = {},
    relations: FindOptionsRelations<EntityModel> = {},
    order: FindOptionsOrder<EntityModel> = {},
    take: number = Pagination.TAKE,
    skip: number = Pagination.SKIP
  ): Promise<EntityModel[]> {
    return this.entityRepository.find({
      where: {
        ...filters,
      },
      relations,
      take: Number(take),
      skip: Number(skip),
      order,
    });
  }

  async findOne(
    filters: FindOptionsWhere<EntityModel>,
    relations?: FindOptionsRelations<EntityModel>
  ): Promise<EntityModel> {
    const foundEntity = await this.entityRepository.findOne({
      where: {
        ...filters,
      },
      relations,
    });

    return foundEntity;
  }

  async findById(
    id: string,
    otherFilters?: FindOptionsWhere<EntityModel>
  ): Promise<EntityModel> {
    return this.entityRepository.findOne({
      where: {
        ...otherFilters,
        id,
      },
    });
  }

  async save(entity: EntityModel) {
    return this.entityRepository.save(entity);
  }
}

export default BaseServiceMethods;
