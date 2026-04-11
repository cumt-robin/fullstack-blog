import type { CommentUserInfo } from "@fullstack-blog/types";

const COMMENT_USER_INFO_KEY = "comment_user_info";

export const useCommentIdentity = () => {
    const state = useState<CommentUserInfo | null>("comment-user-info", () => null);

    const load = () => {
        if (import.meta.server) {
            return state.value;
        }

        const raw = localStorage.getItem(COMMENT_USER_INFO_KEY);
        if (!raw) {
            return state.value;
        }

        try {
            state.value = JSON.parse(raw) as CommentUserInfo;
        } catch {
            state.value = null;
        }
        return state.value;
    };

    const save = (value: CommentUserInfo) => {
        state.value = value;
        if (import.meta.client) {
            localStorage.setItem(COMMENT_USER_INFO_KEY, JSON.stringify(value));
        }
    };

    return {
        commentUserInfo: state,
        loadCommentUserInfo: load,
        saveCommentUserInfo: save,
    };
};
