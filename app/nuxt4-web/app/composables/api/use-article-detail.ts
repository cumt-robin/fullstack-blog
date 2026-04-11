import type { ArticleDTO, RecordResponse } from "@fullstack-blog/types";

export const useArticleDetail = (articleId: MaybeRefOrGetter<number>) => {
    const repositories = useRepositories();
    const idRef = toRef(articleId);

    return useAsyncData(
        computed(() => `article-detail:${idRef.value}`),
        (): Promise<RecordResponse<ArticleDTO>> => repositories.articleRepository.detail(idRef.value),
        { watch: [idRef] },
    );
};
