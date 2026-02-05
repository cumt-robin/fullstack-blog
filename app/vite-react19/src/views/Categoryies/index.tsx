import { useEffect, useState } from "react";
import { Badge, Col, Empty, Row, Skeleton } from "antd";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { categoryService } from "@/services/category";
import { CategoryDTO } from "@/bean/dto";
import { useAsyncLoading } from "@/hooks/async";
import BaseLayout from "@/components/BaseLayout";
import LazyImage from "@/components/LazyImage";
import defaultCategoryPoster from "@/assets/img/default_category.svg";

const StyledBadge = styled(Badge)``;
const StyledNavLink = styled(NavLink)``;

const CategoryRow = styled(Row)`
    .category__card {
        position: relative;
        margin-top: 20px;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }

    ${StyledNavLink},
    ${StyledBadge} {
        display: block;
        width: 100%;
    }

    ${LazyImage} {
        height: 120px;
        object-fit: contain;
    }

    .category__title {
        text-align: center;
        font-size: 14px;
        color: #666;
        padding-bottom: 4px;
    }
`;

const mainCss = css`
    padding: 24px 18px;
    background-color: #f5f5f5;
    @media screen and (min-width: 992px) {
        background-color: transparent;
    }
`;

export const Component: React.FC = () => {
    const [categoryList, setCategoryList] = useState<CategoryDTO[]>([]);

    const handleGetCategoryList = async () => {
        const { data } = await categoryService.all({ getCount: "1" });
        setCategoryList(data);
    };

    const { trigger: getCategoryList, loading } = useAsyncLoading(handleGetCategoryList, [], { initialLoading: true });

    useEffect(() => {
        getCategoryList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BaseLayout mainCss={mainCss}>
            <h2 style={{ marginBottom: "16px", fontSize: "24px", textAlign: "center" }}>文章分类</h2>

            <Skeleton loading={loading} active={true} paragraph={{ rows: 10 }}>
                {categoryList.length > 0 ? (
                    <CategoryRow className="category__list" gutter={16}>
                        {categoryList.map((category) => {
                            return (
                                <Col key={category.id} span={8} md={6} lg={4}>
                                    <StyledNavLink to={`/category/${encodeURIComponent(category.category_name)}`}>
                                        <StyledBadge count={category.category_count}>
                                            <div className="category__card">
                                                <LazyImage src={category.poster || defaultCategoryPoster} className="category__poster" />
                                                <div className="category__title">{category.category_name}</div>
                                            </div>
                                        </StyledBadge>
                                    </StyledNavLink>
                                </Col>
                            );
                        })}
                    </CategoryRow>
                ) : (
                    <Empty />
                )}
            </Skeleton>
        </BaseLayout>
    );
};
