import type { UserDTO } from "@fullstack-blog/types";
import { createBlogApi } from "~/lib/api-client/create-blog-api";
import { createRepositories } from "~/lib/repositories/create-repositories";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const currentUser = useState<UserDTO | null>("current-user", () => null);
    const requestAwareFetch = import.meta.server ? useRequestFetch() : $fetch;

    const blogApi = createBlogApi({
        baseURL: config.public.apiBase,
        fetcher: requestAwareFetch,
        onSessionInvalid: () => {
            currentUser.value = null;
        },
    });

    const getDeviceId = () => (import.meta.client ? useDeviceId() : "");

    return {
        provide: {
            blogApi,
            repositories: createRepositories(blogApi, { getDeviceId }),
        },
    };
});
