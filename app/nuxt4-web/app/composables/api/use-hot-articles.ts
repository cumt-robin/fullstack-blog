import type { ArticleDTO } from "@fullstack-blog/types";

export const useHotArticles = (count = 6) => {
    const repositories = useRepositories();
    return useAsyncData(`hot-articles:${count}`, async (): Promise<ArticleDTO[]> => {
        const response = await repositories.articleRepository.topRead({ count });
        return response.data;
    });
};
