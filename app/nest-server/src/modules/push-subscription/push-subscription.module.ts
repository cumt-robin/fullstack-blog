import { PushSubscription } from "@/entities/PushSubscription";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PushSubscriptionController } from "./push-subscription.controller";
import { PushSubscriptionService } from "./push-subscription.service";

@Module({
    imports: [TypeOrmModule.forFeature([PushSubscription])],
    controllers: [PushSubscriptionController],
    providers: [PushSubscriptionService],
    exports: [PushSubscriptionService],
})
export class PushSubscriptionModule {}
