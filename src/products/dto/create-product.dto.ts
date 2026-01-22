import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Название товара' })
  @IsString()
  name: string;

  @ApiProperty({ example: 999.99, description: 'Цена в USD' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 100, description: 'Количество на складе' })
  @IsNumber()
  @Min(0)
  stock: number;
}
