import React, { useState, useMemo, useRef, useContext } from "react";
import { Button, Input, InputRef, message, Modal } from "antd";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import styled from "styled-components";
import IconSvg from "../IconSvg";
import { commentStyleContext } from "./comment-style-context";
import LazyImage from "@/components/LazyImage";
import avatarFallback from "@/assets/img/comment-avatar.svg";
import replyAvatarFallback from "@/assets/img/reply-avatar.svg";
import { CommentDTO, ReplyDTO } from "@/bean/dto";
import { useAsyncLoading } from "@/hooks/async";
import { format } from "@/utils/date-utils";
import { ellipsis } from "@/styles/styled-mixins/base";
import { useAppSelector } from "@/store/hooks";
import { selectCommentUserInfo } from "@/store/slices/auth";
import { replyService } from "@/services/reply";

interface CardCommentProps {
    comment: CommentDTO;
    isActive: boolean;
    onUserInfoEmpty?: () => void;
    onSetActive?: (id: number) => void;
}

const CommentAvatar = styled(LazyImage).attrs({
    radius: "100%",
})`
    width: 40px;
    height: 40px;
`;

const ReplyAvatar = styled(LazyImage).attrs({
    radius: "100%",
})`
    width: 24px;
    height: 24px;
`;

const CommentWrapper = styled.div<{ $boxShadow?: string }>`
    display: flex;
    padding: 8px 12px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: ${({ $boxShadow }) => $boxShadow || "0 2px 26px rgb(7 17 27 / 12%)"};

    .btn-confirm-reply {
        margin: 0 0 0 10px;
        font-size: 12px;
        height: 20px;
        padding: 0 4px;
    }

    .btn-reply {
        font-size: 12px;
    }

    .comment__info {
        flex: 1;
        margin-left: 6px;
    }

    .comment__user {
        color: #5079b7;
        font-size: 16px;
    }

    .comment__time {
        display: block;
        font-size: 12px;
        color: #999;
    }

    .comment__content {
        color: #333;
        font-size: 16px;
        padding-bottom: 4px;
    }

    .reply__list {
        margin-top: 10px;
        border-top: 1px solid #ccc;
    }

    .reply__card {
        text-align: left;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }

    .reply__header {
        display: flex;
    }

    .reply__subinfo {
        margin-left: 4px;
        padding-top: 4px;
        display: flex;
        font-size: 12px;
    }

    .reply__info {
        flex: 1;
        ${ellipsis}
    }

    .reply__time {
        margin-left: 4px;
        color: #999;
    }

    .reply__content {
        margin-bottom: 4px;
        color: #333;
        font-size: 16px;
    }

    .reply-form {
        margin-top: 10px;
        display: flex;
        align-items: center;
    }
`;

const CardComment: React.FC<CardCommentProps> = ({ comment, isActive, onUserInfoEmpty, onSetActive }) => {
    const commentUserInfo = useAppSelector(selectCommentUserInfo);
    const [replyRootContent, setReplyRootContent] = useState("");
    const [isShowReplyInput, setIsShowReplyInput] = useState(false);
    const rootReplyInputRef = useRef<InputRef>(null);
    const [replyPlaceHolder, setReplyPlaceHolder] = useState("");
    const [isShowSubReplyInput, setIsShowSubReplyInput] = useState(false);
    const [activeSubId, setActiveSubId] = useState(-1);
    const subReplyInputRef = useRef<InputRef>(null);
    const [subReplyForm, setSubReplyForm] = useState({
        content: "",
        parent_id: -1,
    });
    const formattedComment = useMemo(() => {
        return {
            ...comment,
            avatar: comment.avatar || avatarFallback,
            formattedTime: format(comment.create_time, "YYYY年M月D日 HH:mm:ss"),
            jumpoutMiddleLink: comment.site_url ? `/jumpout/${encodeURIComponent(comment.site_url)}` : "",
            replies: comment.replies.map((reply) => ({
                ...reply,
                avatar: reply.avatar || replyAvatarFallback,
                formattedTime: dayjs(reply.create_time).fromNow(),
            })),
        };
    }, [comment]);

    const showReplyRoot = () => {
        if (!commentUserInfo) {
            onUserInfoEmpty?.();
        } else {
            onSetActive?.(comment.id);
            setReplyPlaceHolder(`@ ${comment.nick_name}`);
            setIsShowReplyInput(true);
            setIsShowSubReplyInput(false);
            setTimeout(() => {
                rootReplyInputRef.current?.focus();
            }, 0);
        }
    };

    const handleReplyRoot = async () => {
        if (!replyRootContent) {
            message.warning("您还未输入任何内容！");
            return Promise.reject();
        }
        const purifiedContent = DOMPurify.sanitize(replyRootContent);
        if (!purifiedContent) {
            message.warning("您的输入内容无效，请重新输入合法内容！");
            return Promise.reject();
        }
        await replyService.add({
            comment_id: comment.id,
            parent_id: null,
            jump_url: window.location.href,
            article_id: comment.article_id,
            content: purifiedContent,
            ...commentUserInfo,
        });
        Modal.success({
            title: "温馨提示",
            content: "您的回复已经提交成功，待审核后即可生效！",
        });
        setReplyRootContent("");
        setIsShowReplyInput(false);
    };

    const { trigger: onClickReplyRoot, loading: isReplyRootLoading } = useAsyncLoading(handleReplyRoot, [
        commentUserInfo,
        replyRootContent,
        comment.id,
        comment.article_id,
    ]);

    const showReplySub = (parentReply: ReplyDTO) => {
        if (!commentUserInfo) {
            onUserInfoEmpty?.();
        } else {
            onSetActive?.(comment.id);
            setActiveSubId(parentReply.id);
            setReplyPlaceHolder(`@ ${parentReply.nick_name}`);
            setIsShowReplyInput(false);
            setIsShowSubReplyInput(true);

            // 重置二级回复表单
            setSubReplyForm({
                content: "",
                parent_id: parentReply.id,
            });

            setTimeout(() => {
                subReplyInputRef.current?.focus();
            }, 0);
        }
    };

    const handleReplySub = async () => {
        if (!subReplyForm.content) {
            message.warning("您还未输入任何内容！");
            return Promise.reject();
        }
        const purifiedContent = DOMPurify.sanitize(subReplyForm.content);
        if (!purifiedContent) {
            message.warning("您的输入内容无效，请重新输入合法内容！");
            return Promise.reject();
        }
        await replyService.add({
            comment_id: comment.id,
            parent_id: subReplyForm.parent_id,
            jump_url: window.location.href,
            article_id: comment.article_id,
            content: purifiedContent,
            ...commentUserInfo,
        });
        Modal.success({
            title: "温馨提示",
            content: "您的回复已经提交成功，待审核后即可生效！",
        });
        setSubReplyForm({
            content: "",
            parent_id: -1,
        });
        setIsShowSubReplyInput(false);
    };

    const { trigger: onClickReplySub, loading: isReplySubLoading } = useAsyncLoading(handleReplySub, [
        commentUserInfo,
        subReplyForm,
        comment.id,
        comment.article_id,
    ]);

    const { boxShadow } = useContext(commentStyleContext);

    return (
        <CommentWrapper $boxShadow={boxShadow}>
            <CommentAvatar src={formattedComment?.avatar} placeholder={avatarFallback} />
            <div className="comment__info">
                {formattedComment?.site_url ? (
                    <a className="comment__user" target="_blank" rel="nofollow noreferrer" href={formattedComment.jumpoutMiddleLink}>
                        {formattedComment.nick_name}
                    </a>
                ) : (
                    <span className="comment__user">{formattedComment.nick_name}</span>
                )}
                <span className="comment__time">{formattedComment?.formattedTime}</span>
                <div className="comment__content">{formattedComment?.content}</div>
                <Button className="btn-reply" icon={<IconSvg icon="reply" />} size="small" onClick={showReplyRoot}>
                    回复
                </Button>
                {isActive && isShowReplyInput ? (
                    <div className="reply-form">
                        <Input
                            ref={rootReplyInputRef}
                            value={replyRootContent}
                            onChange={(e) => setReplyRootContent(e.target.value)}
                            size="small"
                            placeholder={replyPlaceHolder}
                        />
                        <Button
                            className="btn-confirm-reply"
                            type="primary"
                            size="small"
                            loading={isReplyRootLoading}
                            onClick={onClickReplyRoot}
                        >
                            发布
                        </Button>
                    </div>
                ) : null}

                {formattedComment?.replies.length > 0 ? (
                    <div className="reply__list">
                        {formattedComment.replies.map((reply) => (
                            <div className="reply__card" key={reply.id}>
                                <div className="reply__header">
                                    <ReplyAvatar src={reply.avatar} placeholder={replyAvatarFallback} />
                                    <div className="reply__subinfo">
                                        <span className="reply__info">
                                            {reply.nick_name}回复{reply.reply_name || formattedComment.nick_name}
                                        </span>
                                        <span className="reply__time">{reply.formattedTime}</span>
                                    </div>
                                </div>

                                <div className="reply__content">{reply.content}</div>
                                <Button
                                    className="btn-reply"
                                    icon={<IconSvg icon="reply" />}
                                    size="small"
                                    onClick={() => showReplySub(reply)}
                                >
                                    回复
                                </Button>

                                {isActive && reply.id === activeSubId && isShowSubReplyInput ? (
                                    <div className="reply-form">
                                        <Input
                                            ref={subReplyInputRef}
                                            value={subReplyForm.content}
                                            onChange={(e) => setSubReplyForm({ ...subReplyForm, content: e.target.value })}
                                            size="small"
                                            placeholder={replyPlaceHolder}
                                        />
                                        <Button
                                            className="btn-confirm-reply"
                                            type="primary"
                                            size="small"
                                            loading={isReplySubLoading}
                                            onClick={onClickReplySub}
                                        >
                                            发布
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </CommentWrapper>
    );
};

export default CardComment;
