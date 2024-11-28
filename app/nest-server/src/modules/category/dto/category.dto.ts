import { QueryPositiveInt } from "@/decorators/query-number.decorator";
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class GetAllCategoriesDto {
    @IsOptional()
    @IsString()
    @IsIn(["0", "1"], { message: "必须是0或1" })
    getCount?: "0" | "1";
}

export class FuzzyQueryCategoriesDto {
    @IsString()
    @IsNotEmpty({ message: "不能为空" })
    wd: string;
}

export class GetCategoryAdminPageDto {
    @IsOptional()
    @QueryPositiveInt(1)
    pageNo: number = 1;

    @IsOptional()
    @QueryPositiveInt(10)
    pageSize: number = 10;
}

export class UpdateCategoryDto {
    @IsInt()
    @IsPositive()
    id?: number;

    @IsString()
    @IsNotEmpty()
    category_name: string;

    @IsOptional()
    @IsString()
    poster?: string;
}
