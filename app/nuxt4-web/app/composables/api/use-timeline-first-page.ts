import type { ArticleDTO, PageResponse } from "@fullstack-blog/types";

export const useTimelineFirstPage = (pageSize = 6) => {
    const repositories = useRepositories();
    return useAsyncData(
        `timeline-first:${pageSize}`,
        (): Promise<PageResponse<ArticleDTO>> => repositories.articleRepository.page({ pageNo: 1, pageSize }),
    );
};
