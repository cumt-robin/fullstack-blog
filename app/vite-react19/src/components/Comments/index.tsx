import { Button, Empty, Input, InputRef, message, Modal, Skeleton } from "antd";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import DOMPurify from "dompurify";
import CardComment from "../CardComment";
import BottomTips from "../BottomTips";
import CommentUserInfoForm from "../CommentUserInfoForm";
import { useScrollBottom } from "@/hooks/scroll";
import { useAsyncLoading } from "@/hooks/async";
import { CommentDTO } from "@/bean/dto";
import { commentService } from "@/services/comment";
import { useAuthStore, selectCommentUserInfo } from "@/store";

interface CommentsProps {
    articleId?: number;
    topic?: string;
    autoLoad?: boolean;
    placeTop?: boolean;
}

const CommentsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;

    .comments__body {
        overflow: auto;
        flex: 1;
        padding: 20px;
    }

    .comments__list {
        > li + li {
            margin-top: 20px;
        }
    }

    .leave-comment {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        box-shadow: 0 -1px 10px 0 rgba(0, 0, 0, 0.1);
        z-index: 2;
    }
`;

const ButtonCreate = styled(Button)`
    margin: 20px auto;
    display: block;
`;

export type CommentsRef = {
    showEditUserInfoForm: () => void;
};

const Comments = forwardRef<CommentsRef, CommentsProps>(({ articleId, topic = "评论", autoLoad, placeTop }, ref) => {
    const [content, setContent] = useState("");
    const commentsBodyRef = useRef<HTMLDivElement>(null);
    const commentUserInfo = useAuthStore(selectCommentUserInfo);
    const [isEditUserInfoVisible, setIsEditUserInfoVisible] = useState(false);

    // 没有评论用户信息，先提示用户录入信息
    const remindCreateUserInfo = useCallback(() => {
        message.warning(`请在${topic}前填写部分必要信息，我们不会公开您的私密信息！`);
        setIsEditUserInfoVisible(true);
    }, [topic]);

    const handlePublish = async () => {
        // 首先校验有没有用户信息
        if (!commentUserInfo) {
            remindCreateUserInfo();
            return Promise.reject();
        }
        if (!content) {
            message.warning("您还未输入任何内容！");
            return Promise.reject();
        }
        const purifiedContent = DOMPurify.sanitize(content);
        if (!purifiedContent) {
            message.warning("您的输入内容无效，请重新输入合法内容！");
            return Promise.reject();
        }
        const params = {
            article_id: articleId,
            content: purifiedContent,
            // 回访url
            jump_url: window.location.href,
            ...commentUserInfo,
        };
        await commentService.add(params);
        // 重置输入内容，防止重复提交
        setContent("");
        message.success(`您的${topic}已经提交成功，待审核后即可生效！`);
    };

    const { trigger: onClickPublish, loading: isPublishLoading } = useAsyncLoading(handlePublish, [
        commentUserInfo,
        remindCreateUserInfo,
        content,
        articleId,
        topic,
    ]);

    useScrollBottom({
        ref: commentsBodyRef as React.RefObject<HTMLElement>,
        onBottomReached: () => {
            console.log("到底了");
        },
        disabled: !autoLoad,
    });

    const [comments, setComments] = useState<CommentDTO[]>([]);

    const [activeId, setActiveId] = useState<number | null>(null);

    const [pageInfo, setPageInfo] = useState({
        pageNo: 1,
        pageSize: 6,
    });

    const prevPageNo = useRef(pageInfo.pageNo);

    const [total, setTotal] = useState(0);

    const isAllLoaded = useMemo(() => total > 0 && total === comments.length, [total, comments]);

    const handleGetComments = async (isLoadMore = false) => {
        const res = await commentService.page({
            ...pageInfo,
            id: articleId,
        });

        if (isLoadMore) {
            setComments((prev) => [...prev, ...res.data]);
        } else {
            setComments(res.data);
        }

        setTotal(res.total);
    };

    const { trigger: getComments, loading: isFetchLoading } = useAsyncLoading(handleGetComments, [pageInfo, articleId], {
        initialLoading: true,
    });

    useEffect(() => {
        const isLoadMore = pageInfo.pageNo > 1 && pageInfo.pageNo !== prevPageNo.current;
        getComments(isLoadMore);
    }, [getComments, pageInfo]);

    useEffect(() => {
        prevPageNo.current = pageInfo.pageNo;
    }, [pageInfo]);

    const commentInputRef = useRef<InputRef>(null);

    const createComment = () => {
        commentInputRef.current?.focus();
    };

    const loadMore = () => {
        if (!isFetchLoading && comments.length < total) {
            setPageInfo((prev) => ({ ...prev, pageNo: prev.pageNo + 1 }));
        }
    };

    useImperativeHandle(ref, () => ({
        showEditUserInfoForm: () => setIsEditUserInfoVisible(true),
    }));

    return (
        <CommentsWrapper>
            {placeTop && (
                <div className="leave-comment">
                    <Input
                        ref={commentInputRef}
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
                        placeholder={`发表${topic}`}
                    />
                    <Button type="primary" size="small" loading={isPublishLoading} onClick={onClickPublish} style={{ marginLeft: "10px" }}>
                        发布
                    </Button>
                </div>
            )}

            <div className="comments__body" ref={commentsBodyRef}>
                {comments.length > 0 && (
                    <ul className="comments__list">
                        {comments.map((comment) => (
                            <li key={comment.id}>
                                <CardComment
                                    comment={comment}
                                    isActive={activeId === comment.id}
                                    onUserInfoEmpty={remindCreateUserInfo}
                                    onSetActive={(id) => setActiveId(id)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
                {comments.length === 0 && !isFetchLoading && (
                    <Empty
                        description={
                            <>
                                暂无{topic}，快来说两句吧！
                                <ButtonCreate type="primary" onClick={createComment}>
                                    创建{topic}
                                </ButtonCreate>
                            </>
                        }
                    />
                )}

                <Skeleton active avatar paragraph={{ rows: 6 }} loading={isFetchLoading} style={{ marginTop: "20px" }} />

                {isAllLoaded && <BottomTips content="没有更多了" />}

                {!isAllLoaded && comments.length > 0 && (
                    <BottomTips
                        children={
                            <Button type="primary" shape="round" onClick={loadMore}>
                                加载更多
                            </Button>
                        }
                    />
                )}
            </div>

            {!placeTop && (
                <div className="leave-comment">
                    <Input
                        ref={commentInputRef}
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
                        placeholder={`发表${topic}`}
                    />
                    <Button type="primary" size="small" loading={isPublishLoading} onClick={onClickPublish} style={{ marginLeft: "10px" }}>
                        发布
                    </Button>
                </div>
            )}

            <Modal
                title="修改个人信息"
                open={isEditUserInfoVisible}
                footer={null}
                styles={{ body: { paddingTop: "20px" } }}
                onCancel={() => setIsEditUserInfoVisible(false)}
            >
                <CommentUserInfoForm
                    topic={topic}
                    onCancel={() => setIsEditUserInfoVisible(false)}
                    onSuccess={() => setIsEditUserInfoVisible(false)}
                />
            </Modal>
        </CommentsWrapper>
    );
});

export default Comments;
