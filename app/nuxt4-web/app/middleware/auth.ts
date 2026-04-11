import { BlogApiError } from "~/types/blog";

export default defineNuxtRouteMiddleware(async (to) => {
    const { currentUser, refreshCurrentUser } = useCurrentUser();
    if (currentUser.value) {
        return;
    }

    try {
        const user = await refreshCurrentUser({ suppressAuthError: true, suppressErrors: true });
        if (!user) {
            return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
        }
    } catch (error) {
        if (error instanceof BlogApiError) {
            return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
        }
        throw error;
    }
});
