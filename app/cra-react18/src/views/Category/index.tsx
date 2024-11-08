import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb, Divider, Empty, Pagination, Skeleton } from "antd";
import BaseLayout from "@/components/BaseLayout";
import { ArticleDTO } from "@/bean/dto";
import { articleService } from "@/services/article";
import { setScrollTop } from "@/utils/dom";
import { useAsyncLoading } from "@/hooks/async";
import CardArticle from "@/components/CardArticle";

const Category: React.FC = () => {
    const { name } = useParams();

    const [articleList, setArticleList] = useState<ArticleDTO[]>([]);

    const [total, setTotal] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();

    const qsPageNo = searchParams.get("pageNo");
    const pageNo = qsPageNo ? Number(qsPageNo) : 1;

    const fetchParams = useMemo(
        () => ({
            pageNo,
            keyword: name as string,
            pageSize: 6,
        }),
        [pageNo, name],
    );

    const prevPageNo = useRef(pageNo);

    const handleGetArticleList = async (isChangePage: boolean) => {
        const { data, total } = await articleService.pageByCategory(fetchParams);
        setArticleList(data);
        setTotal(total);
        if (isChangePage) {
            setScrollTop({
                useAnimation: true,
                duration: 0.3,
            });
        }
    };

    const { trigger: getPageList, loading } = useAsyncLoading(handleGetArticleList, [fetchParams]);

    useEffect(() => {
        const isChangePage = fetchParams.pageNo !== prevPageNo.current;
        getPageList(isChangePage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchParams]);

    useEffect(() => {
        setScrollTop({
            useAnimation: true,
            duration: 0.3,
        });
    }, []);

    useEffect(() => {
        prevPageNo.current = fetchParams.pageNo;
    }, [fetchParams.pageNo]);

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

                        <section>
                            {articleList.map((article) => (
                                <CardArticle article={article} key={article.id} />
                            ))}
                        </section>

                        <Pagination
                            current={fetchParams.pageNo}
                            pageSize={fetchParams.pageSize}
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
