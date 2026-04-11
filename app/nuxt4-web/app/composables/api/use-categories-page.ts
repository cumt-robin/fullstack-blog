import type { CategoryDTO } from "@fullstack-blog/types";

export const useCategoriesPage = () => {
    const repositories = useRepositories();
    return useAsyncData("categories-all-with-count", async (): Promise<CategoryDTO[]> => {
        const response = await repositories.categoryRepository.all({ getCount: "1" });
        return response.data;
    });
};
