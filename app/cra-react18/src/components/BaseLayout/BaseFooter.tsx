import styled from "styled-components";
import { Col, Row } from "antd";
import IconSvg from "../IconSvg";
import LazyImage from "../LazyImage";

const Wrapper = styled.section`
    background-color: #121212;
    color: #ceb8bb;
    padding: 18px 24px;
    .footer-column {
        position: relative;
        + .footer-column {
            margin-top: 24px;
            &::after {
                content: "";
                position: absolute;
                top: -10px;
                left: 0;
                width: 100%;
                height: 1px;
                background-color: #ccc;
            }
        }
        > h3 {
            margin: 10px 0;
            font-size: 18px;
            color: #efefef;
            font-weight: 700;
        }
        > p {
            margin: 6px 0;
            font-size: 12px;
        }
        a {
            font-size: 16px;
            line-height: 1.8;
        }
    }

    .social-list {
        li + li {
            margin-top: 6px;
        }

        ${IconSvg},
        span,
        a {
            vertical-align: middle;
            font-size: 16px;
        }

        ${IconSvg} {
            margin-right: 10px;
            font-size: 24px;
            color: #a8c0cc;
        }
    }

    .wechat-qrcodes {
        display: flex;
    }

    .qrcode {
        flex: 1;
        max-width: 200px;
        overflow: hidden;
        cursor: pointer;
        + .qrcode {
            margin-left: 10px;
        }
    }

    @media screen and (min-width: 992px) {
        .base-footer__inner {
            width: 800px;
            margin: 0 auto;
        }
    }
`;

const publicAccoutQrcode = "https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_bin.jpg";

const mpQrcode = "https://qncdn.wbjiang.cn/Tusi%E5%8D%9A%E5%AE%A2.jpg";

const BaseFooter: React.FC = () => {
    return (
        <Wrapper>
            <div className="base-footer__inner">
                <section className="footer-column">
                    <h3>关于本站</h3>
                    <p>
                        Tusi博客，专注于前端技术分享。除特殊说明外，本站内文章均为博主原创，转载前请联系博主授权，授权后方可转载！转载时，请在显眼位置注明原文出处，谢谢合作！
                    </p>
                </section>
                <section className="footer-column">
                    <h3>GitHub开源</h3>
                    <p>
                        博客代码已开源，您的 Star 是对我最大的支持！
                        <br />
                        <a target="_blank" rel="nofollow noreferrer" href="https://github.com/cumt-robin/fullstack-blog">
                            fullstack-blog
                        </a>
                        <br />
                    </p>
                </section>
                <section className="footer-column">
                    <h3>公众号&小程序</h3>
                    <div className="wechat-qrcodes">
                        <LazyImage src={publicAccoutQrcode} title="公众号-程序员白彬" className="qrcode" />
                        <LazyImage src={mpQrcode} title="小程序-Tusi博客" className="qrcode" />
                    </div>
                </section>
                <section className="footer-column">
                    <h3>联系&交流</h3>
                    <ul className="social-list">
                        <li>
                            <IconSvg title="微信号" icon="wechat" />
                            <a
                                target="_blank"
                                rel="nofollow noreferrer"
                                href="https://qncdn.wbjiang.cn/%E5%85%AC%E4%BC%97%E5%8F%B7/qrcode_bin.jpg"
                            >
                                加我微信
                            </a>
                        </li>
                        <li>
                            <IconSvg title="我的邮箱" icon="email" />
                            <span>cumtrobin@163.com</span>
                        </li>
                        <li>
                            <IconSvg title="github" icon="github" />
                            <a target="_blank" rel="nofollow noreferrer" href="https://github.com/cumt-robin">
                                https://github.com/cumt-robin
                            </a>
                        </li>
                    </ul>
                </section>
                <section className="footer-column">
                    <h3>友情推荐</h3>
                    <Row gutter={12}>
                        <Col span={12}>
                            <a target="_blank" rel="nofollow noreferrer" href="https://chat.wbjiang.cn">
                                随心聊Chat
                            </a>
                        </Col>
                        <Col span={12}>
                            <a target="_blank" href="https://jview.wbjiang.cn/" rel="noreferrer">
                                JView UI
                            </a>
                        </Col>
                        <Col span={12}>
                            <a target="_blank" rel="nofollow noreferrer" href="http://hexo.wbjiang.cn">
                                Tusi博客(Hexo版)
                            </a>
                        </Col>
                        <Col span={12}>
                            <a target="_blank" rel="nofollow noreferrer" href="https://juejin.im/user/5ca40a18f265da30b8178b31/posts">
                                Tusi的掘金
                            </a>
                        </Col>
                        <Col span={12}>
                            <a target="_blank" rel="nofollow noreferrer" href="https://blog.csdn.net/weixin_41196185">
                                Tusi的CSDN
                            </a>
                        </Col>
                        <Col span={12}>
                            <a target="_blank" rel="nofollow noreferrer" href="https://www.whatled.com/">
                                少将全栈
                            </a>
                        </Col>
                    </Row>
                </section>
            </div>
        </Wrapper>
    );
};

export default BaseFooter;
