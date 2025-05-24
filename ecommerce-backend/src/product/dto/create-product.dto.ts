import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ description: '상품의 이름' })
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ description: '상품의 가격' })
  price: number;
}
