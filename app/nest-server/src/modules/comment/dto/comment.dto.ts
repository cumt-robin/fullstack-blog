import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

import { QueryPositiveInt } from "@/decorators/query-number.decorator";

export class GetCommentPageDto {
    @IsOptional()
    @QueryPositiveInt()
    id?: number;

    @IsOptional()
    @QueryPositiveInt(1)
    pageNo: number = 1;

    @IsOptional()
    @QueryPositiveInt(10)
    pageSize: number = 10;
}

export class AddCommentDto {
    @IsString()
    @IsNotEmpty({ message: "不能为空" })
    content: string;

    @IsString()
    @IsNotEmpty({ message: "不能为空" })
    nick_name: string;

    @IsOptional()
    @QueryPositiveInt()
    article_id?: number;

    @IsOptional()
    @IsString()
    @IsUrl()
    jump_url?: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    site_url?: string;
}
