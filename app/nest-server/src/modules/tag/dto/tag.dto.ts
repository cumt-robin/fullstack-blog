import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { QueryPositiveInt } from "@/decorators/query-number.decorator";

export class GetAllTagsDto {
    @IsOptional()
    @IsString()
    @IsIn(["0", "1"], { message: "必须是0或1" })
    getCount?: "0" | "1";
}

export class FuzzyQueryTagsDto {
    @IsString()
    @IsNotEmpty({ message: "不能为空" })
    wd: string;
}
export class GetTagAdminPageDto {
    @IsOptional()
    @QueryPositiveInt(1)
    pageNo: number;

    @IsOptional()
    @QueryPositiveInt(10)
    pageSize: number;
}
