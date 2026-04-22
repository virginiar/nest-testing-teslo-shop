import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // enableImplicitConversions: true
  @ApiProperty({
    default: 10,
    description: 'How many rows do you need',
  })
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) // enableImplicitConversions: true
  @ApiProperty({
    default: 0,
    description: 'How many rows do you want to skip',
  })
  offset?: number;

  @IsOptional()
  @ApiProperty({
    default: '',
    description: 'Filter results by gender',
  })
  gender: 'men' | 'women' | 'unisex' | 'kid';
}
