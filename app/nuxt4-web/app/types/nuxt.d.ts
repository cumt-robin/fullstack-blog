import type { BlogApi } from "~/types/blog";
import type { BlogRepositories } from "~/lib/repositories/create-repositories";

declare module "#app" {
    interface NuxtApp {
        $blogApi: BlogApi;
        $repositories: BlogRepositories;
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $blogApi: BlogApi;
        $repositories: BlogRepositories;
    }
}

export {};
