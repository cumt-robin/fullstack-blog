import { Controller, Get } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { PublicAccess } from "@/decorators/public-access.decorator";

@Controller("banner")
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @PublicAccess()
    @Get("/pc")
    getPcBanners() {
        return this.bannerService.getPcBanners();
    }

    @PublicAccess()
    @Get("/weapp")
    getWeappBanners() {
        return this.bannerService.getWeappBanners();
    }
}
