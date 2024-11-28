import { IsInt, IsOptional, IsPositive } from "class-validator";

import { QueryPositiveInt } from "@/decorators/query-number.decorator";

export class GetCommentPageDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    id?: number;

    @QueryPositiveInt(1)
    pageNo: number = 1;

    @QueryPositiveInt(10)
    pageSize: number = 10;
}
