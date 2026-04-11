import type { BlogApi } from "~/types/blog";
import { createArticleRepository } from "~/lib/repositories/article.repository";
import { createCategoryRepository } from "~/lib/repositories/category.repository";
import { createChatgptRepository } from "~/lib/repositories/chatgpt.repository";
import { createCommentRepository } from "~/lib/repositories/comment.repository";
import { createPushSubscriptionRepository } from "~/lib/repositories/push-subscription.repository";
import type { RepositoryDeviceContext } from "~/lib/repositories/repository-context";
import { createReplyRepository } from "~/lib/repositories/reply.repository";
import { createTagRepository } from "~/lib/repositories/tag.repository";
import { createUserRepository } from "~/lib/repositories/user.repository";
import { createValidatorRepository } from "~/lib/repositories/validator.repository";

export const createRepositories = (api: BlogApi, deviceContext: RepositoryDeviceContext) => ({
    articleRepository: createArticleRepository(api),
    categoryRepository: createCategoryRepository(api),
    tagRepository: createTagRepository(api),
    commentRepository: createCommentRepository(api),
    replyRepository: createReplyRepository(api),
    userRepository: createUserRepository(api, deviceContext),
    validatorRepository: createValidatorRepository(api),
    chatgptRepository: createChatgptRepository(api),
    pushSubscriptionRepository: createPushSubscriptionRepository(api, deviceContext),
});

export type BlogRepositories = ReturnType<typeof createRepositories>;
