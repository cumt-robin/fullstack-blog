import { SubscribePushModel, UnbindPushByDeviceModel, UnsubscribePushModel } from "@fullstack-blog/types";
import { ApiService } from "./core";

class PushSubscriptionService extends ApiService {
    public subscribe(params: SubscribePushModel) {
        return this.$postJson("subscribe", params);
    }

    public unsubscribe(params: UnsubscribePushModel) {
        return this.$postJson("unsubscribe", params);
    }

    public unbindByDevice(params: UnbindPushByDeviceModel = {}) {
        return this.$postJson("unbind-by-device", params);
    }
}

export const pushSubscriptionService = new PushSubscriptionService("push-subscription");
