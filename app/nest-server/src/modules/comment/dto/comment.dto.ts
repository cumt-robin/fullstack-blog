import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, IsIn } from "class-validator";

import { QueryPositiveInt } from "@/decorators/query-number.decorator";
import { Type } from "class-transformer";
import { BodyPositiveInt } from "@/decorators/body-number.decorator";

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

export class GetTypedPageDto {
    @IsOptional()
    @QueryPositiveInt(1)
    pageNo: number = 1;

    @IsOptional()
    @QueryPositiveInt(10)
    pageSize: number = 10;

    @IsIn([1, 2, "1", "2"], { message: "必须是1或2，1是评论，2是留言" })
    @Type(() => Number)
    type: 1 | 2;
}

export class ReviewCommentDto {
    @BodyPositiveInt()
    id: number;

    @IsIn([1, 2, "1", "2"], { message: "必须是1或2，1是审核通过，2是审核不通过" })
    @Type(() => Number)
    approved: 1 | 2;

    @IsOptional()
    @IsString()
    @IsUrl()
    jump_url?: string;
}

export class UpdateCommentDto {
    @BodyPositiveInt()
    id: number;

    @IsOptional()
    @IsIn([0, 1, "0", "1"], { message: "必须是0或1，1是逻辑删除" })
    @Type(() => Number)
    deleted: 0 | 1;
}

export class DeleteCommentDto {
    @QueryPositiveInt()
    id: number;
}
