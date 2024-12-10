import { Module } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerController } from "./banner.controller";
import { Banner } from "@/entities/Banner";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Banner])],
    controllers: [BannerController],
    providers: [BannerService],
})
export class BannerModule {}
