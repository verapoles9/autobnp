import { IsInt, Min, ValidateNested } from 'class-validator';  
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID товара' })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 2, description: 'Количество' })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ 
    type: [OrderItemDto],
    description: 'Массив товаров в заказе'
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
