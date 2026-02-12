import { Image, Space, Table, Button, message, Modal } from "antd";
import { ColumnType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useAsyncLoading } from "@/hooks/async";
import { CommentDTO } from "@fullstack-blog/types";
import CommentAvatarFallback from "@/assets/img/comment-avatar.svg";
import { format } from "@fullstack-blog/utils";
import { commentService } from "@fullstack-blog/services";
import { approvedFormatter } from "@fullstack-blog/utils";

const Wrapper = styled.section`
    padding: 20px;
    background-color: #fff;
`;

const Avatar = styled(Image)`
    && {
        width: 40px;
        height: 40px;
        border-radius: 100%;
    }
`;

export const Component = () => {
    const [messageList, setMessageList] = useState<CommentDTO[]>([]);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共计${total}条`,
        onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
        },
    });

    const handleGetCommentList = async () => {
        const res = await commentService.pageNotApproved({
            pageNo: pagination.current as number,
            pageSize: pagination.pageSize as number,
            type: 1, // 1代表是文章评论
        });
        setMessageList(res.data);
        setPagination({ ...pagination, total: res.total });
    };

    const { loading, trigger: search } = useAsyncLoading(handleGetCommentList, [pagination.current, pagination.pageSize], {
        initialLoading: true,
    });

    useEffect(() => {
        search();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.current, pagination.pageSize]);

    const onCommitReview = async (record: CommentDTO, approved: 1 | 2) => {
        Modal.confirm({
            title: `确认要执行${approved === 1 ? "通过" : "不通过"}操作吗？`,
            onOk: async () => {
                await commentService.review({
                    id: record.id,
                    approved,
                    email: record.email,
                    content: record.content,
                    jump_url: record.jump_url,
                });
                message.success("操作成功");
                search();
            },
        });
    };

    const columns: ColumnType<CommentDTO>[] = [
        {
            title: "昵称",
            width: "120px",
            dataIndex: "nick_name",
        },
        {
            title: "头像",
            dataIndex: "avatar",
            width: "132px",
            render: (_, record) => {
                return <Avatar src={record.avatar} fallback={CommentAvatarFallback} />;
            },
        },
        {
            title: "评论内容",
            dataIndex: "content",
            width: "180px",
        },
        {
            title: "评论的文章",
            dataIndex: "article_name",
            width: "180px",
            render: (_, record) => {
                return <NavLink to={`/article/${record.article_id}`}>{record.article_name}</NavLink>;
            },
        },
        {
            title: "审核状态",
            dataIndex: "approved",
            width: "120px",
            render: (_, record) => {
                return approvedFormatter(record.approved ?? 0);
            },
        },
        {
            title: "邮箱",
            dataIndex: "email",
            width: "140px",
        },
        {
            title: "个人网站",
            dataIndex: "site_url",
            width: "160px",
        },
        {
            title: "创建时间",
            dataIndex: "create_time",
            width: "160px",
            render: (value) => {
                return format(value);
            },
        },
        {
            title: "操作",
            width: "180px",
            key: "action",
            fixed: "right",
            render: (_, record) => {
                return (
                    <Space>
                        <Button type="primary" ghost size="small" onClick={() => onCommitReview(record, 1)}>
                            通过
                        </Button>

                        <Button type="primary" ghost size="small" danger onClick={() => onCommitReview(record, 2)}>
                            不通过
                        </Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <Wrapper>
            <Table
                rowKey="id"
                dataSource={messageList}
                columns={columns}
                loading={loading}
                pagination={loading ? false : pagination}
                scroll={{ x: "max-content" }}
            ></Table>
        </Wrapper>
    );
};
