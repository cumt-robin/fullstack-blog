import { NavLink, useLocation } from "react-router-dom";
import styled, { RuleSet } from "styled-components";
import classNames from "classnames";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import IconSvg from "../IconSvg";
import BaseMenu from "./BaseMenu";
import BaseFooter from "./BaseFooter";
import HotColumn from "./HotColumn";
import logo from "@/assets/img/logo.png";
import { useIsAuthed } from "@/store/hooks/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setIsMenuVisible } from "@/store/slices/ui";

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
`;

const BaseLayout: React.FC<PropsWithChildren<{ mainCss?: RuleSet }>> = ({ children, mainCss }) => {
    const isAuthed = useIsAuthed();
    const isMenuVisible = useAppSelector((state) => state.ui.isMenuVisible);
    const dispatch = useAppDispatch();
    const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);

    const location = useLocation();

    const hideMenu = useCallback(() => {
        dispatch(setIsMenuVisible(false));
    }, [dispatch]);

    useEffect(() => {
        hideMenu();
    }, [location, hideMenu]);

    const onToggleMenu = () => {
        if (isAnimationEnabled === false) {
            setIsAnimationEnabled(true);
        }
        if (isMenuVisible) {
            // 走统一的关闭逻辑
            hideMenu();
        } else {
            dispatch(setIsMenuVisible(true));
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
        </LayoutWrapper>
    );
};

export default BaseLayout;
