import { QueryPositiveInt } from "@/decorators/query-number.decorator";
import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class SubscribePushDto {
    @IsString()
    @IsNotEmpty()
    @IsUrl({
        protocols: ["https"],
        require_protocol: true,
    })
    @MaxLength(1000)
    endpoint: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    p256dh: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    auth: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    userAgent?: string;
}

export class UnsubscribePushDto {
    @IsString()
    @IsNotEmpty()
    @IsUrl({
        protocols: ["https"],
        require_protocol: true,
    })
    @MaxLength(1000)
    endpoint: string;
}

export class UnbindPushByDeviceDto {
    @IsOptional()
    @IsString()
    @IsUrl({
        protocols: ["https"],
        require_protocol: true,
    })
    @MaxLength(1000)
    endpoint?: string;
}

export class PushSubscriptionAdminPageDto {
    @QueryPositiveInt(1)
    @Type(() => Number)
    pageNo: number = 1;

    @QueryPositiveInt(20)
    @Type(() => Number)
    pageSize: number = 20;

    @IsOptional()
    @IsIn([0, 1, "0", "1"])
    @Type(() => Number)
    status?: 0 | 1;
}
