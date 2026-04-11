import type { ArticleDTO, ArrayResponse } from "@fullstack-blog/types";

export const useArticleNeighbors = (articleId: MaybeRefOrGetter<number>) => {
    const repositories = useRepositories();
    const idRef = toRef(articleId);

    return useAsyncData(
        computed(() => `article-neighbors:${idRef.value}`),
        (): Promise<ArrayResponse<ArticleDTO>> => repositories.articleRepository.neighbors(idRef.value),
        { watch: [idRef] },
    );
};
