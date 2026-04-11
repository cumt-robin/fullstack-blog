import type { ArticleDTO, PageResponse } from "@fullstack-blog/types";

export const useTagArticles = (tagName: MaybeRefOrGetter<string>, pageSize = 6) => {
    const route = useRoute();
    const repositories = useRepositories();
    const nameRef = toRef(tagName);
    const pageNo = computed(() => Math.max(1, Number(route.query.pageNo || 1)));

    return useAsyncData(
        computed(() => `tag-articles:${nameRef.value}:${pageNo.value}`),
        (): Promise<PageResponse<ArticleDTO>> =>
            repositories.articleRepository.pageByTag({
                pageNo: pageNo.value,
                pageSize,
                keyword: nameRef.value,
            }),
        { watch: [nameRef, pageNo] },
    );
};
