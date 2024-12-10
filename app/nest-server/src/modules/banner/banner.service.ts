import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Banner } from "@/entities/Banner";

@Injectable()
export class BannerService {
    constructor(
        @InjectRepository(Banner)
        private readonly bannerRepository: Repository<Banner>,
    ) {}

    async getPcBanners() {
        const data = await this.bannerRepository.find({ where: { type: 1 } });
        return {
            data,
        };
    }

    async getWeappBanners() {
        const data = await this.bannerRepository.find({ where: { type: 2 } });
        return {
            data,
        };
    }
}
