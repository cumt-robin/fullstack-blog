import type { SubscribePushModel, UnbindPushByDeviceModel, UnsubscribePushModel } from "@fullstack-blog/types";
import type { BlogApi } from "~/types/blog";
import type { RepositoryDeviceContext } from "~/lib/repositories/repository-context";

export const createPushSubscriptionRepository = (api: BlogApi, ctx: RepositoryDeviceContext) => ({
    subscribe: (params: SubscribePushModel) => api.postJson("/push-subscription/subscribe", params, { "X-Device-Id": ctx.getDeviceId() }),
    unsubscribe: (params: UnsubscribePushModel) => api.postJson("/push-subscription/unsubscribe", params),
    unbindByDevice: (params: UnbindPushByDeviceModel = {}) =>
        api.postJson("/push-subscription/unbind-by-device", params, { "X-Device-Id": ctx.getDeviceId() }),
});
