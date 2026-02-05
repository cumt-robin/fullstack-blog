import styled from "styled-components";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { commentService } from "@/services/comment";
import { useAuthStore } from "@/store";
import Comments, { CommentsRef } from "@/components/Comments";
import { commentStyleContext } from "@/components/CardComment/comment-style-context";

const MessageWrapper = styled.section`
    .msgs-stats {
        font-size: 12px;
        color: #999;
        text-align: center;
        padding-bottom: 10px;
    }

    .user-count {
        font-size: 16px;
        color: #333;
        font-weight: 700;
    }

    .modify-info {
        text-align: center;
        font-size: 10px;
        color: #999;
        margin-bottom: 10px;
        cursor: pointer;
    }
`;

export const Component: React.FC = () => {
    const [userCount, setUserCount] = useState(0);
    const [messageTotal, setMessageTotal] = useState(0);
    const commentUserInfo = useAuthStore((state) => state.commentUserInfo);
    const commentsRef = useRef<CommentsRef | null>(null);

    const getMessageUserCount = async () => {
        const res = await commentService.numberOfPeople();
        setUserCount(res.data);
    };

    const getMessageTotal = async () => {
        const res = await commentService.total();
        setMessageTotal(res.data);
    };

    useEffect(() => {
        getMessageUserCount();
        getMessageTotal();
    }, []);

    const showUserInfoForm = () => {
        commentsRef.current?.showEditUserInfoForm();
    };

    return (
        <BaseLayout>
            <commentStyleContext.Provider value={{ boxShadow: "0 2px 12px rgb(7 17 27 / 12%)" }}>
                <MessageWrapper>
                    <div className="stats-info">
                        <div className="msgs-stats">
                            已有<strong className="user-count">{userCount}</strong>人在这留下了足迹
                        </div>
                        <div className="msgs-stats">
                            留言总数：<strong className="user-count">{messageTotal}</strong>条
                        </div>

                        {commentUserInfo ? (
                            <div className="modify-info" onClick={showUserInfoForm}>
                                个人信息有误？点击修改
                                <EditOutlined style={{ marginLeft: "6px" }} />
                            </div>
                        ) : null}
                    </div>

                    <Comments ref={commentsRef} topic="留言" placeTop={true} autoLoad={false} />
                </MessageWrapper>
            </commentStyleContext.Provider>
        </BaseLayout>
    );
};
