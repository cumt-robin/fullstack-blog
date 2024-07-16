import { useCallback, useEffect, useState } from "react";
import { Card, Empty } from "antd";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import LazyImage from "../LazyImage";
import { ArticleDTO } from "@/bean/dto";
import { useAsyncLoading } from "@/hooks/async";
import { articleService } from "@/services/article";

const StyledCard = styled(Card)`
    margin: 36px 24px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    .ant-card-head-title {
        padding: 12px 0;
    }

    ul > li + li {
        margin-top: 10px;
    }

    ${LazyImage} {
        float: left;
        width: 60px;
        height: 60px;
    }

    .text-wrapper {
        margin-left: 70px;
        > h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #333;
            font-weight: 700;
        }
        > span {
            font-size: 10px;
            color: #666;
        }
    }

    @media screen and (min-width: 992px) {
        width: 800px;
        margin: 36px auto;
    }
`;

const HotColumn: React.FC = () => {
    const [hotList, setHotList] = useState<ArticleDTO[]>([]);
    const handleGetHotList = useCallback(async () => {
        const res = await articleService.topRead({
            count: 6,
        });
        setHotList(res.data);
    }, []);

    const { trigger: getHotList, loading } = useAsyncLoading(handleGetHotList);

    useEffect(() => {
        getHotList();
    }, [getHotList]);

    return (
        <StyledCard title={<div>热门推荐</div>} hoverable={true} loading={loading}>
            {hotList.length > 0 ? (
                <ul>
                    {hotList.map((article, index) => {
                        return (
                            <li key={article.id} className="clearfix">
                                <NavLink to={`/article/${article.id}`}>
                                    <LazyImage src={article.poster} style={{ objectFit: "cover" }} />
                                    <div className="text-wrapper">
                                        <h3 className="ellipsis" title={article.article_name}>
                                            {article.article_name}
                                        </h3>
                                        <span>阅读&nbsp;{article.read_num}</span>
                                    </div>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <Empty />
            )}
        </StyledCard>
    );
};

export default HotColumn;
