import type { ArticleDTO, PageResponse } from "@fullstack-blog/types";

export const useCategoryArticles = (categoryName: MaybeRefOrGetter<string>, pageSize = 6) => {
    const route = useRoute();
    const repositories = useRepositories();
    const nameRef = toRef(categoryName);
    const pageNo = computed(() => Math.max(1, Number(route.query.pageNo || 1)));

    return useAsyncData(
        computed(() => `category-articles:${nameRef.value}:${pageNo.value}`),
        (): Promise<PageResponse<ArticleDTO>> =>
            repositories.articleRepository.pageByCategory({
                pageNo: pageNo.value,
                pageSize,
                keyword: nameRef.value,
            }),
        { watch: [nameRef, pageNo] },
    );
};
