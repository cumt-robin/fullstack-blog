import { Image, Space, Table, Button, message, Modal } from "antd";
import { ColumnType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAsyncLoading } from "@/hooks/async";
import { CommentDTO } from "@/bean/dto";
import CommentAvatarFallback from "@/assets/img/comment-avatar.svg";
import { format } from "@/utils/date-utils";
import { commentService } from "@/services/comment";
import { approvedFormatter } from "@/utils/formatter";

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

    const handleGetArticleList = async () => {
        const res = await commentService.pageAdmin({
            pageNo: pagination.current as number,
            pageSize: pagination.pageSize as number,
            type: 2, // 2代表是留言
        });
        setMessageList(res.data);
        setPagination({ ...pagination, total: res.total });
    };

    const { loading, trigger: search } = useAsyncLoading(handleGetArticleList, [pagination.current, pagination.pageSize], {
        initialLoading: true,
    });

    useEffect(() => {
        search();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.current, pagination.pageSize]);

    const onClickLogicDel = async (record: CommentDTO) => {
        const isDeleted = record.deleted === 1;
        Modal.confirm({
            title: `确认要执行${isDeleted ? "逻辑恢复" : "逻辑删除"}吗？`,
            onOk: async () => {
                await commentService.update({
                    id: record.id,
                    deleted: isDeleted ? 0 : 1,
                });
                message.success("操作成功");
                search();
            },
        });
    };

    const onClickDel = async (record: CommentDTO) => {
        Modal.confirm({
            title: "确认要删除吗？",
            onOk: async () => {
                await commentService.delete(record.id);
                message.success("操作成功");
                if (pagination.current === 1) {
                    search();
                } else {
                    setPagination({ ...pagination, current: 1 });
                }
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
            title: "留言内容",
            dataIndex: "content",
            width: "180px",
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
            title: "更新时间",
            dataIndex: "update_time",
            width: "160px",
            render: (value) => {
                return value ? format(value) : "-";
            },
        },
        {
            title: "操作",
            width: "180px",
            key: "action",
            fixed: "right",
            render: (_, record, index) => {
                return (
                    <Space>
                        <Button type="primary" ghost size="small" danger={record.deleted !== 1} onClick={() => onClickLogicDel(record)}>
                            {record.deleted === 1 ? "逻辑恢复" : "逻辑删除"}
                        </Button>

                        <Button type="primary" ghost size="small" onClick={() => onClickDel(record)}>
                            物理删除
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
