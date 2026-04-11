import type { PageResponse } from "@fullstack-blog/types";
import type { ArticleDTO } from "@fullstack-blog/types";

export const useHomeArticles = (pageSize = 6) => {
    const route = useRoute();
    const repositories = useRepositories();
    const pageNo = computed(() => Math.max(1, Number(route.query.pageNo || 1)));

    return useAsyncData(
        computed(() => `home-articles:${pageNo.value}`),
        (): Promise<PageResponse<ArticleDTO>> => repositories.articleRepository.page({ pageNo: pageNo.value, pageSize }),
        { watch: [pageNo] },
    );
};
