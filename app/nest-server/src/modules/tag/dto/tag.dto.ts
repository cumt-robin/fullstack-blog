import { IsIn, IsOptional, IsString } from "class-validator";

export class GetAllTagsDto {
    @IsOptional()
    @IsString()
    @IsIn(["0", "1"], { message: "必须是0或1" })
    getCount?: "0" | "1";
}
