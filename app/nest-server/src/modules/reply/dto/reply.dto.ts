import { BodyPositiveInt } from "@/decorators/body-number.decorator";
import { Type } from "class-transformer";
import { IsOptional, IsNotEmpty, IsString, IsIn } from "class-validator";

export class AddReplyDto {
    @BodyPositiveInt()
    comment_id: number;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    nick_name: string;

    @IsOptional()
    @BodyPositiveInt()
    parent_id: number;

    @IsOptional()
    @BodyPositiveInt()
    article_id: number;

    @IsOptional()
    @IsString()
    jump_url: string;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    site_url: string;

    @IsOptional()
    @IsString()
    avatar: string;

    @IsOptional()
    @IsString()
    device: string;
}

export class ReviewReplyDto {
    @BodyPositiveInt()
    id: number;

    @IsIn([1, 2, "1", "2"], { message: "必须是1或2，1是审核通过，2是审核不通过" })
    @Type(() => Number)
    approved: 1 | 2;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    jump_url: string;
}
