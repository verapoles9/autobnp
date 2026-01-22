import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ 
    example: 'iPhone 15 Pro Max', 
    description: 'Новое название (опционально)' 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    example: 1099.99, 
    description: 'Новая цена (опционально)' 
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ 
    example: 150, 
    description: 'Новое количество на складе (опционально)' 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
