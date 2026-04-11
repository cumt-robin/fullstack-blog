import type { LoginModel, UserDTO } from "@fullstack-blog/types";
import { BlogApiError } from "~/types/blog";

export const useCurrentUser = () => {
    const currentUser = useState<UserDTO | null>("current-user", () => null);
    const repositories = useRepositories();

    const clearCurrentUser = () => {
        currentUser.value = null;
    };

    const refreshCurrentUser = async (options: { suppressAuthError?: boolean; suppressErrors?: boolean } = {}) => {
        try {
            const response = await repositories.userRepository.current();
            currentUser.value = response.data;
            return response.data;
        } catch (error) {
            currentUser.value = null;
            if (options.suppressErrors) {
                return null;
            }
            if (options.suppressAuthError && error instanceof BlogApiError) {
                return null;
            }
            throw error;
        }
    };

    const login = async (payload: LoginModel) => {
        const response = await repositories.userRepository.login(payload);
        currentUser.value = response.data;
        return response.data;
    };

    const logout = async () => {
        await repositories.userRepository.logout();
        currentUser.value = null;
    };

    return {
        currentUser,
        clearCurrentUser,
        refreshCurrentUser,
        login,
        logout,
    };
};
