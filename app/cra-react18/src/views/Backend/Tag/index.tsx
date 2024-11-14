import { Space, Table, Button } from "antd";
import { ColumnType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useAsyncLoading } from "@/hooks/async";
import { TagDTO } from "@/bean/dto";
import { format } from "@/utils/date-utils";
import { tagService } from "@/services/tag";

const Wrapper = styled.section`
    padding: 20px;
    background-color: #fff;
`;

export const Component = () => {
    const [tagList, setTagList] = useState<TagDTO[]>([]);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共计${total}条`,
        onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
        },
    });

    const handleGetTagList = async () => {
        const res = await tagService.adminPage({
            pageNo: pagination.current as number,
            pageSize: pagination.pageSize as number,
        });
        setTagList(res.data);
        setPagination({ ...pagination, total: res.total });
    };

    const { loading, trigger: search } = useAsyncLoading(handleGetTagList, [pagination.current, pagination.pageSize], {
        initialLoading: true,
    });

    useEffect(() => {
        search();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.current, pagination.pageSize]);

    const columns: ColumnType<TagDTO>[] = [
        {
            title: "标签名称",
            width: "120px",
            dataIndex: "tag_name",
            ellipsis: true,
            fixed: "left",
        },
        {
            title: "文章数量",
            dataIndex: "article_count",
            width: "100px",
            ellipsis: true,
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
            width: "120px",
            key: "action",
            fixed: "right",
            render: (_, record, index) => {
                return (
                    <Space>
                        <NavLink to={`/tag/${encodeURIComponent(record.tag_name)}`}>
                            <Button type="primary" ghost size="small">
                                标签下文章
                            </Button>
                        </NavLink>
                    </Space>
                );
            },
        },
    ];

    return (
        <Wrapper>
            <Table
                rowKey="id"
                dataSource={tagList}
                columns={columns}
                loading={loading}
                pagination={loading ? false : pagination}
                scroll={{ x: "max-content" }}
            ></Table>
        </Wrapper>
    );
};
