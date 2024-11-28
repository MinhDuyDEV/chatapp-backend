import { ClassConstructor, plainToInstance } from 'class-transformer';

export class DtoHelper {
  static mapToDto<T>(dto: ClassConstructor<T>, data: any): T {
    return plainToInstance(dto, data, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  static mapToPaginatedDto<T>(
    dto: ClassConstructor<T>,
    data: any,
    total: number,
    page: number,
    limit: number,
  ) {
    return {
      data: this.mapToDto(dto, data),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
