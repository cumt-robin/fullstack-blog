import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { Breadcrumb, Divider, Empty, Pagination, Skeleton } from "antd";
import BaseLayout from "@/components/BaseLayout";
import { ArticleDTO } from "@/bean/dto";
import { articleService } from "@/services/article";
import { setScrollTop } from "@/utils/dom";
import { useAsyncLoading } from "@/hooks/async";
import CardArticle from "@/components/CardArticle";

const ArticleList = styled.section``;

const Category: React.FC = () => {
    const { name } = useParams();

    const [articleList, setArticleList] = useState<ArticleDTO[]>([]);

    const [total, setTotal] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();

    const qsPageNo = searchParams.get("pageNo");
    const pageNo = qsPageNo ? Number(qsPageNo) : 1;
    const [pageInfo, setPageInfo] = useState({ pageNo, pageSize: 6 });

    const prevPageNo = useRef(pageInfo.pageNo);

    const handleGetArticleList = useCallback(
        async (isChangePage: boolean) => {
            const { data, total } = await articleService.pageByCategory({
                ...pageInfo,
                keyword: name as string,
            });
            setArticleList(data);
            setTotal(total);
            if (isChangePage) {
                setScrollTop({
                    useAnimation: true,
                    duration: 0.3,
                });
            }
        },
        [pageInfo, name],
    );

    const { trigger: getPageList, loading } = useAsyncLoading(handleGetArticleList, [pageInfo, name]);

    useEffect(() => {
        const qsPageNo = searchParams.get("pageNo");
        const pageNo = qsPageNo ? Number(qsPageNo) : 1;
        if (pageNo && pageNo > 0 && pageNo !== prevPageNo.current) {
            setPageInfo((prevPageInfo) => ({
                ...prevPageInfo,
                pageNo,
            }));
        }
    }, [searchParams]);

    useEffect(() => {
        const isChangePage = pageInfo.pageNo !== prevPageNo.current;
        getPageList(isChangePage);
    }, [pageInfo, getPageList]);

    useEffect(() => {
        prevPageNo.current = pageInfo.pageNo;
    }, [pageInfo]);

    // 分页改变
    const onPageNoChange = (page: number) => {
        setSearchParams({ pageNo: String(page) });
    };

    return (
        <BaseLayout>
            <Skeleton loading={loading} active={true} paragraph={{ rows: 12 }}>
                {articleList.length > 0 ? (
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <NavLink to="/">首页</NavLink>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <NavLink to="/categories">所有分类</NavLink>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{name}</Breadcrumb.Item>
                        </Breadcrumb>

                        <Divider />

                        <ArticleList>
                            {articleList.map((article) => (
                                <CardArticle article={article} key={article.id} />
                            ))}
                        </ArticleList>

                        <Pagination
                            current={pageInfo.pageNo}
                            pageSize={pageInfo.pageSize}
                            total={total}
                            showLessItems={true}
                            simple={true}
                            showSizeChanger={false}
                            onChange={onPageNoChange}
                            className="mt-5 justify-center"
                        />
                    </>
                ) : (
                    <Empty />
                )}
            </Skeleton>
        </BaseLayout>
    );
};

export default Category;
