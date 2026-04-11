import type { TagDTO } from "@fullstack-blog/types";

export const useTagsPage = () => {
    const repositories = useRepositories();
    return useAsyncData("tags-all-with-count", async (): Promise<TagDTO[]> => {
        const response = await repositories.tagRepository.all({ getCount: "1" });
        return response.data;
    });
};
