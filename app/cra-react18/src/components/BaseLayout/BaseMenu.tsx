import styled from "styled-components";
import { Row, Col } from "antd";
import { NavLink } from "react-router-dom";
import IconSvg from "@/components/IconSvg";
import avatarImg from "@/assets/img/avatar.jpg";

interface BaseMenuProps {
    open: boolean;
}

const Section = styled.section<BaseMenuProps>`
    position: absolute;
    top: 0;
    width: 230px;
    height: 100%;
    background: #222;
    transform: translate3d(-100%, 0, 0);
    ${(props) =>
        props.open &&
        `
        box-shadow: 0 0 30px 0 rgba(27, 14, 14, 0.3);
    `}

    .menu__list {
        ${IconSvg} {
            margin-right: 6px;
        }
    }

    .menu__header {
        padding: 10px 20px 11px 20px;
        background-color: #393c3e;
        text-align: center;
        > h2 {
            color: rgba(245, 157, 173, 0.76);
            font-weight: 700;
            font-size: 24px;
            margin: 16px 0;
        }
        .avatar-wrap {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 16px;
        }
        .avatar-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(102, 110, 210, 0.29);
            border-radius: 100%;
        }
        .avatar {
            display: block;
            width: 100%;
            border-radius: 100%;
        }
        .location {
            font-size: 14px;
            color: #ecc;
            margin: 20px 0;
        }
        .social-list {
            .ant-col:hover {
                ${IconSvg} {
                    color: #fff;
                }
            }
            ${IconSvg} {
                color: #ecc;
                transition: color 0.3s ease-in-out;
            }
        }
    }

    .menu__item {
        border-left: 2px solid transparent;
        transition: all 0.3s ease-in-out;
        font-size: 14px;
        line-height: 3;
        &:hover {
            border-left-color: #3c8dbc;
            background-color: #312e2e;
            > a {
                color: #fff;
            }
        }
        > a {
            display: block;
            padding: 0 20px;
            color: #b8c7ce;
            transition: color 0.3s ease-in-out;
            &.router-link-active {
                color: #fff;
            }
        }
    }
`;

const BaseMenu: React.FC<BaseMenuProps> = ({ open }) => {
    return (
        <Section open={open}>
            <ul className="menu__list">
                <li className="menu__header">
                    <h2>Tusi博客</h2>
                    <div className="avatar-wrap">
                        <div className="avatar-mask"></div>
                        <img className="avatar" src={avatarImg} alt="avatar" />
                    </div>
                    <div className="location">
                        <IconSvg icon="location" />
                        湖南长沙
                    </div>
                    <Row className="social-list">
                        <Col span={8}>
                            <a
                                title="微信"
                                href="http://qncdn.wbjiang.cn/%E5%BE%AE%E4%BF%A1%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%90%8D%E7%89%87.jpg"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <IconSvg icon="wechat" size={24} />
                            </a>
                        </Col>
                        <Col span={8}>
                            <a title="github" href="https://github.com/cumt-robin" target="_blank" rel="nofollow noreferrer">
                                <IconSvg icon="github" size={24} />
                            </a>
                        </Col>
                        <Col span={8}>
                            <a
                                title="掘金"
                                href="https://juejin.im/user/5ca40a18f265da30b8178b31/posts"
                                target="_blank"
                                rel="nofollow noreferrer"
                            >
                                <IconSvg icon="juejin" size={24} />
                            </a>
                        </Col>
                    </Row>
                </li>
                <li className="menu__item">
                    <NavLink to="/">
                        <IconSvg icon="home" />
                        首页
                    </NavLink>
                </li>
                <li className="menu__item">
                    <NavLink to="/categories">
                        <IconSvg icon="folder" />
                        分类
                    </NavLink>
                </li>
                <li className="menu__item">
                    <NavLink to="/tags">
                        <IconSvg icon="tag" />
                        标签
                    </NavLink>
                </li>
                <li className="menu__item">
                    <NavLink to="/timeline">
                        <IconSvg icon="time-axis" />
                        时间轴
                    </NavLink>
                </li>
                <li className="menu__item">
                    <NavLink to="/messages">
                        <IconSvg icon="leave-message" />
                        留言
                    </NavLink>
                </li>
                <li className="menu__item">
                    <a href="https://chat.wbjiang.cn" target="_blank" rel="nofollow noreferrer">
                        <IconSvg icon="chat" />
                        随心聊Chat
                    </a>
                </li>
                <li className="menu__item">
                    <NavLink to="/chatgpt">
                        <IconSvg icon="chat" />
                        ChatGPT体验
                    </NavLink>
                </li>
                <li className="menu__item">
                    <NavLink to="/chat">
                        <IconSvg icon="chat" />
                        在线交流
                    </NavLink>
                </li>
                <li className="menu__item">
                    <a target="_blank" href="https://github.com/cumt-robin/fullstack-blog" rel="nofollow noreferrer">
                        <IconSvg icon="github" />
                        开源地址
                    </a>
                </li>
            </ul>
        </Section>
    );
};

export default BaseMenu;
