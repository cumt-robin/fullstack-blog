import { useEffect, useRef, useState } from "react";
import { Button, Card, Empty, Skeleton, Timeline } from "antd";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { ArticleDTO } from "@/bean/dto";
import BaseLayout from "@/components/BaseLayout";
import { articleService } from "@/services/article";
import { format } from "@/utils/date-utils";
import { useAsyncLoading } from "@/hooks/async";
import LazyImage from "@/components/LazyImage";
import BottomTips from "@/components/BottomTips";

const StyledTimeline = styled(Timeline)`
    .timeline-card {
        border: 0;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        .ant-card-body {
            display: flex;
            padding: 10px;
        }
    }
    ${LazyImage} {
        width: 80px;
        height: 60px;
        object-fit: cover;
    }

    .timeline-card__info {
        flex: 1;
        margin-left: 10px;
        font-size: 12px;
        overflow: hidden;

        > time {
            color: #999;
        }

        > h4 {
            margin: 3px 0;
            font-size: 14px;
            line-height: 1.2em;
        }

        .category {
            font-weight: 700;

            &:hover {
                color: #87b4e2;
                opacity: 0.85;
            }

            + .category::before {
                content: ", ";
            }
        }
    }
`;

export const Component: React.FC = () => {
    const [articleList, setArticleList] = useState<ArticleDTO[]>([]);

    const [pageInfo, setPageInfo] = useState({
        pageNo: 1,
        pageSize: 6,
    });

    const prevPageNo = useRef(pageInfo.pageNo);

    const [total, setTotal] = useState(0);

    const handleGetArticleList = async (isLoadMore = false) => {
        const res = await articleService.page(pageInfo);
        const mappedData = res.data.map((item) => {
            return {
                ...item,
                create_time: format(item.create_time),
            };
        });
        if (isLoadMore) {
            setArticleList([...articleList, ...mappedData]);
        } else {
            setArticleList(mappedData);
        }
        setTotal(res.total);
    };

    const { trigger: getPageList, loading } = useAsyncLoading(handleGetArticleList, [pageInfo]);

    useEffect(() => {
        const isChangePage = pageInfo.pageNo !== prevPageNo.current;
        getPageList(isChangePage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageInfo.pageNo]);

    useEffect(() => {
        prevPageNo.current = pageInfo.pageNo;
    }, [pageInfo.pageNo]);

    const loadMore = () => {
        if (articleList.length < total) {
            setPageInfo({ ...pageInfo, pageNo: pageInfo.pageNo + 1 });
        }
    };

    return (
        <BaseLayout>
            <>
                {articleList.length ? (
                    <StyledTimeline>
                        {articleList.map((article) => (
                            <Timeline.Item key={article.id} color="#2b82a8">
                                <Card className="timeline-card">
                                    <NavLink to={`/article/${article.id}`}>
                                        <LazyImage src={article.poster} />
                                    </NavLink>
                                    <div className="timeline-card__info">
                                        <time>{article.create_time}</time>
                                        <h4 className="truncate" title={article.article_name}>
                                            {article.article_name}
                                        </h4>
                                        {article.categories.map((category) => (
                                            <NavLink
                                                className="category"
                                                key={category.id}
                                                to={`/category/${encodeURIComponent(category.categoryName)}`}
                                            >
                                                <span>{category.categoryName}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </Card>
                            </Timeline.Item>
                        ))}
                    </StyledTimeline>
                ) : null}

                {!articleList.length && !loading ? <Empty /> : null}

                <Skeleton loading={loading} active paragraph={{ rows: 6 }} />

                <BottomTips>
                    {articleList.length < total ? (
                        <Button shape="round" type="primary" onClick={loadMore}>
                            加载更多
                        </Button>
                    ) : (
                        <span>没有更多了</span>
                    )}
                </BottomTips>
            </>
        </BaseLayout>
    );
};
