import { Image, Space, Tag, Table, Button, message, Modal } from "antd";
import { ColumnType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { articleService } from "@/services/article";
import { useAsyncLoading } from "@/hooks/async";
import { ArticleDTO } from "@/bean/dto";
import LogoFallback from "@/assets/img/logo2.png";
import { format } from "@/utils/date-utils";

const Wrapper = styled.section`
    padding: 20px;
    background-color: #fff;
`;

const StyledImage = styled(Image)`
    && {
        width: 100px;
        height: 72px;
        object-fit: cover;
    }
`;

export const Component = () => {
    const navigate = useNavigate();

    const [articleList, setArticleList] = useState<ArticleDTO[]>([]);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共计${total}条`,
        onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
        },
    });

    const [activeIndex, setActiveIndex] = useState(-1);

    const handleGetArticleList = async () => {
        const res = await articleService.pageAdmin({
            pageNo: pagination.current as number,
            pageSize: pagination.pageSize as number,
        });
        setArticleList(res.data);
        setPagination({ ...pagination, total: res.total });
    };

    const { loading, trigger: search } = useAsyncLoading(handleGetArticleList, [pagination.current, pagination.pageSize], {
        initialLoading: true,
    });

    useEffect(() => {
        search();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.current, pagination.pageSize]);

    const handlePrivate = async (record: ArticleDTO, index: number) => {
        setActiveIndex(index);
        await articleService.updatePrivate({
            id: record.id,
            private: record.private === 0 ? 1 : 0,
        });
        message.success("操作成功");
        search();
    };

    const { loading: isPrivateLoading, trigger: onClickPrivate } = useAsyncLoading(handlePrivate);

    const onClickEdit = (record: ArticleDTO) => {
        navigate(`/backend/article/edit/${record.id}`);
    };

    const onClickLogicDel = async (record: ArticleDTO) => {
        const isDeleted = record.deleted === 1;
        Modal.confirm({
            title: `确认要执行${isDeleted ? "逻辑恢复" : "逻辑删除"}吗？`,
            onOk: async () => {
                await articleService.updateDeleted({
                    id: record.id,
                    deleted: isDeleted ? 0 : 1,
                });
                message.success("操作成功");
                search();
            },
        });
    };

    const onClickDel = async (record: ArticleDTO) => {
        Modal.confirm({
            title: "确认要删除吗？",
            onOk: async () => {
                await articleService.delete(record.id);
                message.success("操作成功");
                setPagination({ ...pagination, current: 1 });
            },
        });
    };

    const columns: ColumnType<ArticleDTO>[] = [
        {
            title: "文章",
            dataIndex: "article_name",
            width: "160px",
            render: (_, record) => {
                return <NavLink to={`/article/${record.id}`}>{record.article_name}</NavLink>;
            },
        },
        {
            title: "封面",
            dataIndex: "poster",
            width: "132px",
            render: (_, record) => {
                return <StyledImage src={record.poster} fallback={LogoFallback} />;
            },
        },
        {
            title: "作者",
            dataIndex: "author",
            width: "80px",
        },
        {
            title: "阅读量",
            dataIndex: "read_num",
            width: "80px",
        },
        {
            title: "分类",
            dataIndex: "categories",
            width: "200px",
            render: (_, record) => {
                return (
                    <Space style={{ flexWrap: "wrap", rowGap: "10px" }}>
                        {record.categories.map((item) => {
                            return (
                                <NavLink key={item.id} to={`/category/${encodeURIComponent(item.categoryName)}`}>
                                    <Tag color="blue" style={{ cursor: "pointer" }}>
                                        {item.categoryName}
                                    </Tag>
                                </NavLink>
                            );
                        })}
                    </Space>
                );
            },
        },
        {
            title: "标签",
            dataIndex: "tags",
            width: "200px",
            render: (_, record) => {
                return (
                    <Space style={{ flexWrap: "wrap", rowGap: "10px" }}>
                        {record.tags.map((item) => {
                            return (
                                <NavLink key={item.id} to={`/tag/${encodeURIComponent(item.tagName)}`}>
                                    <Tag color="green" style={{ cursor: "pointer" }}>
                                        {item.tagName}
                                    </Tag>
                                </NavLink>
                            );
                        })}
                    </Space>
                );
            },
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
            width: "300px",
            key: "action",
            fixed: "right",
            render: (_, record, index) => {
                return (
                    <Space>
                        <Button
                            type="primary"
                            ghost
                            size="small"
                            loading={index === activeIndex && isPrivateLoading}
                            onClick={() => onClickPrivate(record, index)}
                        >
                            {record.private === 1 ? "公开" : "私密"}
                        </Button>

                        <Button type="primary" ghost size="small" onClick={() => onClickEdit(record)}>
                            编辑
                        </Button>

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
                dataSource={articleList}
                columns={columns}
                loading={loading}
                pagination={loading ? false : pagination}
                scroll={{ x: "max-content" }}
            ></Table>
        </Wrapper>
    );
};
