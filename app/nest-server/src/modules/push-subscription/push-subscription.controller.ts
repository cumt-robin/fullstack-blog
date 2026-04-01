import { PublicAccess } from "@/decorators/public-access.decorator";
import { InnerException } from "@/exceptions/inner.exception";
import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";
import { PushSubscriptionAdminPageDto, SubscribePushDto, UnbindPushByDeviceDto, UnsubscribePushDto } from "./dto/push-subscription.dto";
import { PushSubscriptionService } from "./push-subscription.service";

@Controller("push-subscription")
export class PushSubscriptionController {
    constructor(private readonly pushSubscriptionService: PushSubscriptionService) {}

    private getDeviceId(deviceIdHeader: string | string[] | undefined) {
        const deviceId = Array.isArray(deviceIdHeader) ? deviceIdHeader[0] || "" : deviceIdHeader || "";
        if (!deviceId) {
            throw new InnerException("000005", "device_id missing");
        }
        return deviceId;
    }

    @PublicAccess()
    @Post("subscribe")
    subscribe(
        @Body() body: SubscribePushDto,
        @Headers("authorization") authorization: string | undefined,
        @Headers("x-device-id") deviceIdHeader: string | string[] | undefined,
    ) {
        return this.pushSubscriptionService.subscribe(body, authorization, this.getDeviceId(deviceIdHeader));
    }

    @PublicAccess()
    @Post("unsubscribe")
    unsubscribe(@Body() body: UnsubscribePushDto) {
        return this.pushSubscriptionService.unsubscribe(body.endpoint);
    }

    @PublicAccess()
    @Post("unbind-by-device")
    unbindByDevice(@Body() body: UnbindPushByDeviceDto, @Headers("x-device-id") deviceIdHeader: string | string[] | undefined) {
        return this.pushSubscriptionService.unbindByDevice(this.getDeviceId(deviceIdHeader), body.endpoint);
    }

    @Get("admin_page")
    adminPage(@Query() query: PushSubscriptionAdminPageDto) {
        return this.pushSubscriptionService.adminPage(query.pageNo, query.pageSize, query.status);
    }
}
