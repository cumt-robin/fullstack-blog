import DOMPurify from "dompurify";
import marked from "marked";
import mermaid from "mermaid";
// hljs 按需加载
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import cssLang from "highlight.js/lib/languages/css";
import shell from "highlight.js/lib/languages/shell";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
// 皮肤
import "highlight.js/styles/atom-one-dark.css";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { maxBy } from "lodash-es";
import { minBy } from "lodash-es";
import { Button, Drawer, Empty, Image, Modal, Skeleton, Tag } from "antd";
import { EditOutlined, SwapLeftOutlined, SwapRightOutlined } from "@ant-design/icons";
import styled, { css } from "styled-components";
import { articleService } from "@/services/article";
import BaseLayout from "@/components/BaseLayout";
import { ArticleDTO } from "@/bean/dto";
import { useAsyncLoading } from "@/hooks/async";
import { setScrollTop } from "@/utils/dom";
import { format } from "@/utils/date-utils";
import LazyImage from "@/components/LazyImage";
import Comments, { CommentsRef } from "@/components/Comments";
import avatar from "@/assets/img/avatar.jpg";
import wechatPayme from "@/assets/img/wechat_payme.jpg";
import IconSvg from "@/components/IconSvg";
import { useIsAuthed } from "@/store/hooks/auth";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("css", cssLang);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("json", json);
hljs.registerLanguage("plaintext", plaintext);

const rewardTipsCss = css`
    .reward__tips {
        position: relative;
        color: #999;
        font-weight: 600;
        padding: 0 24px;
        &::before {
            content: "\\201C";
            position: absolute;
            left: 0;
            bottom: 0;
            color: #392570;
            font-size: 45px;
        }
        &::after {
            content: "\\201D";
            position: absolute;
            right: 0;
            top: 0;
            color: #392570;
            font-size: 45px;
        }
    }
`;

const Wrapper = styled.section`
    .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        vertical-align: middle;
    }

    .article__infos {
        margin-left: 14px;
        vertical-align: top;
        color: #999;
        font-size: 14px;
        .author {
            font-size: 18px;
            font-weight: 700;
            color: #333;
        }
        .role-tag {
            margin-left: 6px;
            background: #1989fa;
            padding: 0 4px;
            border-radius: 4px;
            color: #fff;
            font-size: 12px;
            display: inline-block;
            line-height: 1.5;
        }
        .read_total {
            margin-left: 8px;
        }
    }

    .article__main {
        > h2 {
            margin: 0 0 0.6em 0;
            font-size: 1.8em;
        }
    }

    .relation-info {
        padding-bottom: 40px;
        .ant-tag {
            cursor: pointer;
            border-radius: 2px;
        }
    }

    .article__poster {
        margin: 20px 0;
        width: 100%;
        height: 200px;
        transition: transform 0.2s ease-in-out;
        box-shadow:
            0 0 6px rgba(109, 43, 43, 0.1),
            10px 10px 100px rgba(112, 100, 212, 0.24);
        object-fit: cover;
        &:hover {
            transform: scale(1.01);
        }

        @media screen and (min-width: 576px) {
            height: 300px;
        }

        @media screen and (min-width: 1200px) {
            height: 420px;
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(1.1);
        }
    }

    .anim-pulse {
        will-change: transform;
        animation: pulse 0.6s ease-in-out infinite alternate;
    }

    .reward__wrapper {
        text-align: center;
        padding: 20px 0;
        .ant-btn {
            width: 48px;
            height: 48px;
            margin-top: 10px;
            font-size: 18px;
            font-weight: 500;
            border: 0;
            border-radius: 100%;
            line-height: 48px;
            text-align: center;
            padding: 0;
        }
    }

    ${rewardTipsCss}

    .copyright {
        padding: 20px 0;
        > p {
            padding: 10px;
            color: #121212;
            background: #f3f3f3;
            border-left: 6px solid #121212;
            > strong {
                font-size: 18px;
                color: #3b77e3;
                margin: 0 4px;
            }
        }
    }

    .pre-next-wrap {
        margin-top: 10px;
    }

    .prev,
    .next {
        padding: 6px 10px;
        border-radius: 2px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }

    .prev + .next {
        margin-top: 20px;
    }

    .comment__trigger {
        text-align: center;
        margin-top: 36px;
    }
`;

const StyledModal = styled(Modal)`
    .reward-popup__wrapper {
        padding: 50px 0 20px;
        text-align: center;
    }

    ${rewardTipsCss}

    .payme {
        margin-top: 20px;
        width: 100%;
    }
`;

const StyledDrawer = styled(Drawer)`
    .ant-drawer-content-wrapper {
        max-width: 400px;
    }
    .ant-drawer-wrapper-body {
        display: flex;
        flex-direction: column;
    }
    .ant-drawer-body {
        flex: 1;
        padding: 0;
        display: flex;
        overflow: auto;
    }
`;

export const ComponentImpl = forwardRef(({ articleId }: { articleId: number }, ref) => {
    const [article, setArticle] = useState<ArticleDTO>();

    const [purifiedContent, setPurifiedContent] = useState("");

    const [prevArticle, setPrevArticle] = useState<ArticleDTO>();
    const [nextArticle, setNextArticle] = useState<ArticleDTO>();

    const [isRewardVisible, setIsRewardVisible] = useState(false);
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const [previewImgSrc, setPreviewImgSrc] = useState("");
    const commentsRef = useRef<CommentsRef | null>(null);

    const navigate = useNavigate();

    const formattedTime = useMemo(() => {
        return article?.create_time ? format(article.create_time, "YYYY年M月D日") : "";
    }, [article]);

    const setMarkedOptions = () => {
        const renderer = new marked.Renderer();

        renderer.link = function customLink(href, title, text) {
            return `<a class="link" rel="nofollow" href="${href}" title="${text}">${text}</a>`;
        };

        renderer.image = function customImage(href, title, text) {
            return `<div class="img-wrapper" title="${text}">
                        <img src="${href}" alt="${text}">
                    </div>`;
        };

        renderer.code = function customCode(code, language) {
            if (language === "mermaid") {
                return `<div class="mermaid">${code}</div>`;
            }
            return `<pre><code>${code}</code></pre>`;
        };

        marked.setOptions({
            renderer,
            highlight(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : "plaintext";
                return hljs.highlight(code, { language }).value;
            },
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false,
        });
    };

    let reportTimer: number | null = null;

    const clearReportTimer = () => {
        if (reportTimer) {
            clearTimeout(reportTimer);
            reportTimer = null;
        }
    };

    const startReportTimer = () => {
        clearReportTimer();
        reportTimer = window.setTimeout(() => {
            articleService.updateReadNum(articleId);
        }, 5000);
    };

    const getPreAndNextArticle = async () => {
        const res = await articleService.neighbors(articleId);
        const results = res.data;
        if (results.length > 0) {
            switch (results.length) {
                case 1:
                    const singleArticle = results[0];
                    singleArticle.id < articleId ? setPrevArticle(singleArticle) : setNextArticle(singleArticle);
                    break;
                case 2:
                    setPrevArticle(minBy(results, "id"));
                    setNextArticle(maxBy(results, "id"));
                    break;
            }
        }
    };

    const handleGetArticleDetail = async () => {
        const res = await articleService.detail(articleId);

        setArticle(res.data);

        const markedContent = marked(res.data.article_text);

        setPurifiedContent(DOMPurify.sanitize(markedContent));

        startReportTimer();

        window.setTimeout(() => {
            mermaid.initialize({
                theme: "default",
                startOnLoad: false,
            });

            mermaid.run();
        }, 0);
    };

    const { loading, trigger: getArticleDetail } = useAsyncLoading(handleGetArticleDetail, [], { initialLoading: true });

    useEffect(() => {
        setScrollTop();
        getArticleDetail();
        setMarkedOptions();
        getPreAndNextArticle();

        return () => {
            clearReportTimer();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickRichContent = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "A") {
            e.preventDefault();
            navigate(`/jumpout/${encodeURIComponent((target as HTMLAnchorElement).href)}`);
        } else if (target.tagName === "IMG") {
            e.preventDefault();
            setPreviewImgSrc((target as HTMLImageElement).src);
            const previewImgWrapper = document.getElementById("previewImgWrapper") as HTMLDivElement;
            previewImgWrapper.click();
        }
    };

    const showUserInfoForm = () => {
        commentsRef.current?.showEditUserInfoForm();
    };

    const postLink = window.location.href;

    useImperativeHandle(ref, () => ({
        openComment: () => setIsCommentVisible(true),
    }));

    return (
        <Wrapper>
            <Skeleton loading={loading} active avatar paragraph={{ rows: 20 }}>
                {article ? (
                    <article>
                        <header className="flex">
                            <img className="avatar" src={avatar} alt="作者头像" />
                            <div className="article__infos">
                                <span className="author">Tusi</span>
                                <sup className="role-tag">博主</sup>
                                <div>
                                    <time>发布于{formattedTime}</time>
                                    <span className="read_total">阅读&nbsp;&nbsp;{article.read_num}</span>
                                </div>
                            </div>
                        </header>
                        <main className="article__main">
                            <LazyImage src={article.poster} className="article__poster" />
                            <h2>{article.article_name}</h2>
                            <section
                                className="md-preview"
                                dangerouslySetInnerHTML={{ __html: purifiedContent }}
                                onClick={onClickRichContent}
                            ></section>
                        </main>
                        <div className="copyright">
                            <p>
                                本文链接：<a href={postLink}>{postLink}</a>
                                <br />
                                版权声明：本文由<strong>Tusi</strong>原创，发表于{formattedTime}，如需转载，请联系作者授权！
                            </p>
                        </div>

                        <div className="relation-info">
                            <div>
                                分类：
                                {article.categories.map((category) => (
                                    <NavLink key={category.id} to={`/category/${encodeURIComponent(category.categoryName)}`}>
                                        <Tag>{category.categoryName}</Tag>
                                    </NavLink>
                                ))}
                            </div>

                            <div style={{ marginTop: "20px" }}>
                                标签：
                                {article.tags.map((tag) => (
                                    <NavLink key={tag.id} to={`/tag/${encodeURIComponent(tag.tagName)}`}>
                                        <Tag>{tag.tagName}</Tag>
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="reward__wrapper">
                            <p className="reward__tips">您的支持将鼓励我继续创作！</p>
                            <Button type="primary" onClick={() => setIsRewardVisible(true)}>
                                赏
                            </Button>
                        </div>
                    </article>
                ) : (
                    <Empty />
                )}
            </Skeleton>

            <div className="pre-next-wrap">
                {prevArticle ? (
                    <div className="prev">
                        <SwapLeftOutlined />
                        <span>上一篇：</span>
                        <NavLink to={`/article/${prevArticle.id}`}>
                            <span>{prevArticle.article_name}</span>
                        </NavLink>
                    </div>
                ) : null}

                {nextArticle ? (
                    <div className="next">
                        <SwapRightOutlined />
                        <span>下一篇：</span>
                        <NavLink to={`/article/${nextArticle.id}`}>
                            <span>{nextArticle.article_name}</span>
                        </NavLink>
                    </div>
                ) : null}
            </div>

            <div className="comment__trigger">
                <Button type="primary" onClick={() => setIsCommentVisible(true)}>
                    查看评论
                </Button>
            </div>

            <StyledModal open={isRewardVisible} footer={null} onCancel={() => setIsRewardVisible(false)}>
                <div className="reward-popup__wrapper">
                    <p className="reward__tips">感谢您的赞赏支持！</p>
                    <img className="payme" src={wechatPayme} alt="赞赏二维码" />
                </div>
            </StyledModal>

            <StyledDrawer
                open={isCommentVisible}
                title={
                    <>
                        <span>评论区</span>
                        <EditOutlined style={{ marginLeft: "10px" }} onClick={showUserInfoForm} />
                    </>
                }
                onClose={() => setIsCommentVisible(false)}
            >
                <Comments ref={commentsRef} articleId={articleId} />
            </StyledDrawer>

            <Image id="previewImgWrapper" src={previewImgSrc} style={{ display: "none" }} />
        </Wrapper>
    );
});

const mainCss = css`
    @media screen and (min-width: 1200px) {
        width: 1000px;
    }
`;

export const Component: React.FC = () => {
    const location = useLocation();

    const isAuthed = useIsAuthed();

    const implRef = useRef<{ openComment: () => void }>(null);

    const { id } = useParams();

    const articleId = Number(id);

    const navigate = useNavigate();

    const goToEdit = () => {
        navigate(`/backend/article/edit/${articleId}`);
    };

    const openComment = () => {
        implRef.current?.openComment();
    };

    return (
        <BaseLayout
            mainCss={mainCss}
            asideIcons={
                <>
                    {isAuthed && <IconSvg icon="edit" onClick={goToEdit} />}
                    <IconSvg icon="leave-message" onClick={openComment} />
                </>
            }
        >
            <ComponentImpl key={location.pathname} ref={implRef} articleId={articleId} />
        </BaseLayout>
    );
};
