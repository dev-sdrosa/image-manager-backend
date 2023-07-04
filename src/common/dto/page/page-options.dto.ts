import { ApiPropertyOptional, ApiProperty,  } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min, IsString } from "class-validator";
import { Order, OrderUnsplash } from "src/common/enums/order.enums";

export class PageOptionsDto {

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}

export class PageImagesDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;
}

export class PageUnsplashDto extends PageOptionsDto {
  @ApiProperty({
    description: 'Query for unplash images search',
    type: String,
  })
  @IsString()
  readonly query?: string;

  @ApiPropertyOptional({ enum: OrderUnsplash, default: OrderUnsplash.relevant })
  @IsEnum(OrderUnsplash)
  @IsOptional()
  readonly order?: OrderUnsplash = OrderUnsplash.relevant;
}