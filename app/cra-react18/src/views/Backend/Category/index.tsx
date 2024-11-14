import { Image, Space, Table, Button, Modal } from "antd";
import { ColumnType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Edit from "./Edit";
import { useAsyncLoading } from "@/hooks/async";
import { CategoryDTO } from "@/bean/dto";
import LogoFallback from "@/assets/img/logo2.png";
import { format } from "@/utils/date-utils";
import { categoryService } from "@/services/category";

const Wrapper = styled.section`
    padding: 20px;
    background-color: #fff;
`;

const StyledImage = styled(Image)`
    && {
        width: 160px;
        height: 72px;
        object-fit: cover;
    }
`;

export const Component = () => {
    const [categoryList, setCategoryList] = useState<CategoryDTO[]>([]);
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [detailRow, setDetailRow] = useState<CategoryDTO>();

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共计${total}条`,
        onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
        },
    });

    const handleGetCategoryList = async () => {
        const res = await categoryService.adminPage({
            pageNo: pagination.current as number,
            pageSize: pagination.pageSize as number,
        });
        setCategoryList(res.data);
        setPagination({ ...pagination, total: res.total });
    };

    const { loading, trigger: search } = useAsyncLoading(handleGetCategoryList, [pagination.current, pagination.pageSize], {
        initialLoading: true,
    });

    useEffect(() => {
        search();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.current, pagination.pageSize]);

    const onClickEdit = (record: CategoryDTO) => {
        setDetailRow(record);
        setIsEditVisible(true);
    };

    const onEditSuccess = () => {
        setIsEditVisible(false);
        search();
    };

    const columns: ColumnType<CategoryDTO>[] = [
        {
            title: "分类名称",
            width: "120px",
            dataIndex: "category_name",
            ellipsis: true,
            fixed: "left",
        },
        {
            title: "封面",
            dataIndex: "poster",
            width: "192px",
            render: (_, record) => {
                return <StyledImage src={record.poster} fallback={LogoFallback} />;
            },
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
            width: "200px",
            key: "action",
            fixed: "right",
            render: (_, record, index) => {
                return (
                    <Space>
                        <Button type="primary" ghost size="small" onClick={() => onClickEdit(record)}>
                            编辑
                        </Button>
                        <NavLink to={`/category/${encodeURIComponent(record.category_name)}`}>
                            <Button type="primary" ghost size="small">
                                分类下文章
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
                dataSource={categoryList}
                columns={columns}
                loading={loading}
                pagination={loading ? false : pagination}
                scroll={{ x: "max-content" }}
            ></Table>

            <Modal title="编辑分类" width="640px" footer={null} open={isEditVisible} onCancel={() => setIsEditVisible(false)}>
                {isEditVisible && detailRow && <Edit row={detailRow} onSuccess={onEditSuccess} />}
            </Modal>
        </Wrapper>
    );
};
