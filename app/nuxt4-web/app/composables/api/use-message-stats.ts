export const useMessageStats = () => {
    const repositories = useRepositories();
    return useAsyncData("messages-stats", async () => {
        const [peopleRes, totalRes] = await Promise.all([
            repositories.commentRepository.numberOfPeople(),
            repositories.commentRepository.total(),
        ]);
        return { userCount: peopleRes.data, messageTotal: totalRes.data };
    });
};
