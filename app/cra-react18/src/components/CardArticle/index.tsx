import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { format } from "@fullstack-blog/utils";
import { ArticleDTO } from "@fullstack-blog/types";
import LazyImage from "../LazyImage";
import IconSvg from "@/components/IconSvg";

interface CardArticleProps {
    article: ArticleDTO;
}

const StyledNavLink = styled(NavLink)``;

const Article = styled.article`
    padding-bottom: 30px;
    border-bottom: 1px solid #ccc;
    perspective: 400;

    & + & {
        margin-top: 30px;
    }

    > header {
        font-size: 14px;
        color: #7a7a7a;
        font-weight: 700;
        > ul {
            > li {
                display: inline-flex;
                align-items: center;
                + li {
                    margin-left: 20px;
                }
                .category + .category::before {
                    content: ", ";
                }
            }
        }
        ${IconSvg} {
            margin-right: 4px;
        }
        h2 {
            color: #333;
            font-size: 1.5em;
            font-weight: 700;
        }
    }

    > section {
        ${LazyImage} {
            width: 100%;
            height: 200px;
            transition: transform 0.2s ease-in-out;
            box-shadow:
                0 0 6px rgba(109, 43, 43, 0.1),
                10px 10px 100px rgba(112, 100, 212, 0.24);
            &:hover {
                transform: scale(1.01);
            }

            @media screen and (min-width: 576px) {
                height: 360px;
            }
        }

        > p {
            font-size: 16px;
            margin: 20px 0;
        }
    }

    > footer {
        ${StyledNavLink} {
            display: inline-block;
            line-height: 0;
            color: #1761c5;
            font-weight: 700;
            padding: 6px 10px;
            background: #eee;
            border-radius: 4px;
            > span {
                vertical-align: middle;
                font-size: 16px;
                margin-right: 4px;
            }
        }
    }
`;

const CardArticle: React.FC<CardArticleProps> = ({ article }) => {
    const createTime = format(article.create_time, "YYYY年M月D日");

    return (
        <Article>
            <header>
                <ul>
                    <li title="发布日期">
                        <IconSvg className="align-middle" icon="time" />
                        <time className="align-middle">{createTime}</time>
                    </li>
                    <li title="文章分类">
                        <IconSvg className="align-middle" icon="folder" />
                        {article.categories.map((category) => (
                            <NavLink
                                key={category.id}
                                to={`/category/${encodeURIComponent(category.categoryName)}`}
                                className="category align-middle"
                            >
                                {category.categoryName}
                            </NavLink>
                        ))}
                    </li>
                    <li title="阅读量">
                        <IconSvg className="align-middle" icon="eye" />
                        <span className="align-middle">{article.read_num}</span>
                    </li>
                </ul>
                <NavLink to={`/article/${article.id}`}>
                    <h2 className="article__title">{article.article_name}</h2>
                </NavLink>
            </header>

            <section>
                <NavLink to={`/article/${article.id}`}>
                    <LazyImage src={article.poster} />
                </NavLink>
                <p>{article.summary}</p>
            </section>

            <footer>
                <StyledNavLink to={`/article/${article.id}`}>
                    <span>阅读全文</span>
                    <IconSvg className="align-middle" icon="read" />
                </StyledNavLink>
            </footer>
        </Article>
    );
};

export default CardArticle;
