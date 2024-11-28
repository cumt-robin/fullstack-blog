import { Type } from "class-transformer";
import { BodyPositiveInt } from "@/decorators/body-number.decorator";
import { QueryPositiveInt } from "@/decorators/query-number.decorator";
import { ArrayMinSize, IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetTopReadDto {
    @QueryPositiveInt()
    count: number;
}

export class GetPageDto {
    @QueryPositiveInt(1)
    pageNo: number = 1;

    @QueryPositiveInt(10)
    pageSize: number = 10;
}

export class GetNeighborsDto {
    @QueryPositiveInt()
    id: number;
}

export class UpdateReadNumDto {
    @BodyPositiveInt()
    id: number;
}

export class UpdatePrivateDto {
    @BodyPositiveInt()
    id: number;

    @IsIn([0, 1, "0", "1"], { message: "必须是0或1" })
    @Type(() => Number)
    private: 0 | 1;
}

export class UpdateDeletedDto {
    @BodyPositiveInt()
    id: number;

    @IsIn([0, 1, "0", "1"], { message: "必须是0或1" })
    @Type(() => Number)
    deleted: 0 | 1;
}

export class DeleteDto {
    @QueryPositiveInt()
    id: number;
}

export class DetailDto {
    @QueryPositiveInt()
    id: number;
}

export class GetPageWithKeywordDto extends GetPageDto {
    @IsString()
    @IsNotEmpty()
    keyword: string;
}

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    articleTitle: string;

    @IsString()
    @IsNotEmpty()
    articleText: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsString()
    @IsNotEmpty()
    poster: string;

    @IsOptional()
    @IsArray()
    newCategories: string[];

    @IsOptional()
    @IsArray()
    oldCategoryIds: number[];

    @IsArray()
    @ArrayMinSize(1)
    tags: string[];
}

export class UpdateArticleDto {
    @BodyPositiveInt()
    id: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    articleTitle: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    articleText: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    poster: string;

    @IsOptional()
    @IsArray()
    deleteCategoryIDs: number[];

    @IsOptional()
    @IsArray()
    newCategories: string[];

    @IsOptional()
    @IsArray()
    relatedCategoryIDs: number[];

    @IsOptional()
    @IsArray()
    deleteTagIDs: number[];

    @IsOptional()
    @IsArray()
    newTags: string[];

    @IsOptional()
    @IsIn([0, 1, "0", "1"], { message: "必须是0或1" })
    @Type(() => Number)
    private: 0 | 1;
}
