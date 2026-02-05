import { NavLink } from "react-router-dom";
import styled, { RuleSet } from "styled-components";
import classNames from "classnames";
import { PropsWithChildren, useEffect, useState } from "react";
import { throttle } from "lodash-es";
import IconSvg from "../IconSvg";
import BaseMenu from "./BaseMenu";
import BaseFooter from "./BaseFooter";
import HotColumn from "./HotColumn";
import logo from "@/assets/img/logo.png";
import { useIsAuthed } from "@/store/hooks/auth";
import { useUIStore } from "@/store";
import { setScrollTop } from "@/utils/dom";
import { flexCenter } from "@/styles/styled-mixins/base";

const Header = styled.header`
    padding: 18px 40px;
    background: linear-gradient(to bottom right, #2177a7, #5fb7ac);
    text-align: center;
    > a {
        display: inline-block;
    }
    > h3 {
        margin: 20px 0;
        color: #eaeab3;
        font-size: 20px;
        font-weight: 400;
        text-shadow:
            0 1px 0 #2e2e2e,
            0 2px 0 #2c2c2c,
            0 3px 0 #2a2a2a,
            0 4px 0 #282828,
            0 5px 0 #262626,
            0 6px 0 #242424;
    }
`;

const HeaderIconWrapper = styled.div`
    position: absolute;
    top: 20px;
    left: 12px;
    ${IconSvg} {
        font-size: 24px;
        color: #fff;
        cursor: pointer;
    }
`;

const Mask = styled.div<{ open: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.24);
    z-index: 100;
    display: ${({ open }) => (open ? "block" : "none")};
`;

const Main = styled.main<{ $mainCss?: RuleSet }>`
    padding: 24px 24px 0;
    @media screen and (min-width: 992px) {
        width: 800px;
        margin: 0 auto;
    }
    ${({ $mainCss }) => $mainCss};
`;

const LayoutWrapper = styled.section`
    min-height: 100%;

    > aside {
        position: fixed;
        bottom: 160px;
        right: 24px;

        ${IconSvg} {
            ${flexCenter}
            color: #fff;
            font-size: 24px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: rgba(102, 57, 57, 0.4);
            cursor: pointer;
            outline: none;
            + ${IconSvg} {
                margin-top: 10px;
                margin-left: 0;
            }
        }
    }
`;

const BaseLayout: React.FC<PropsWithChildren<{ mainCss?: RuleSet; asideIcons?: React.ReactNode }>> = ({
    children,
    asideIcons,
    mainCss,
}) => {
    const isAuthed = useIsAuthed();
    const isMenuVisible = useUIStore((state) => state.isMenuVisible);
    const setIsMenuVisible = useUIStore((state) => state.setIsMenuVisible);
    const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);
    const [isShowGoTopIcon, setIsShowGoTopIcon] = useState(false);

    const hideMenu = () => {
        setIsMenuVisible(false);
    };

    useEffect(() => {
        let hideTimer: number | null = null;
        const clearHideTimer = () => {
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
        };

        const setHideTimer = () => {
            clearHideTimer();
            hideTimer = window.setTimeout(() => {
                setIsShowGoTopIcon(false);
            }, 5000);
        };

        const onScroll = () => {
            const currScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            if (currScrollTop > 0) {
                setIsShowGoTopIcon(true);
                setHideTimer();
            } else {
                setIsShowGoTopIcon(false);
            }
        };

        const onScrollThrottle = throttle(onScroll, 300, { leading: true });

        document.addEventListener("scroll", onScrollThrottle);
        return () => {
            hideMenu();
            document.removeEventListener("scroll", onScrollThrottle);
            clearHideTimer();
            document.body.style.overflow = "";
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onToggleMenu = () => {
        if (isAnimationEnabled === false) {
            setIsAnimationEnabled(true);
        }
        if (isMenuVisible) {
            // 走统一的关闭逻辑
            hideMenu();
        } else {
            setIsMenuVisible(true);
            // 在弹出菜单时保证禁用滚动
            document.body.style.overflow = "hidden";
        }
    };

    const onSectionAnimationEnd = () => {
        if (isMenuVisible === false) {
            setIsAnimationEnabled(false);
            // 解禁滚动
            document.body.style.overflow = "";
        }
    };

    const onClickMask = () => {
        hideMenu();
    };

    const goToTop = () => {
        setScrollTop({
            useAnimation: true,
        });
    };

    const sectionClass = classNames({
        slideInLeft: isMenuVisible,
        slideOutLeft: !isMenuVisible,
        "animated faster": isAnimationEnabled,
    });

    return (
        <LayoutWrapper className={sectionClass} onAnimationEnd={onSectionAnimationEnd}>
            <Header>
                <NavLink to="/">
                    <img src={logo} alt="logo" />
                </NavLink>
                <h3>一个坚持原创的前端分享驿站</h3>
                <HeaderIconWrapper>
                    <IconSvg icon="menu" title="打开菜单" onClick={onToggleMenu} />
                    {isAuthed ? (
                        <NavLink to="/backend" title="进入后台" className="ml-2">
                            <IconSvg icon="admin" />
                        </NavLink>
                    ) : null}
                </HeaderIconWrapper>
            </Header>

            <Main $mainCss={mainCss}>{children}</Main>

            <HotColumn />

            <BaseFooter />

            <BaseMenu open={isMenuVisible} />

            <Mask open={isMenuVisible} onClick={onClickMask} />

            <aside>
                {asideIcons}
                <IconSvg icon="arrow-up" style={{ display: isShowGoTopIcon ? "flex" : "none" }} onClick={goToTop} />
            </aside>
        </LayoutWrapper>
    );
};

export default BaseLayout;
