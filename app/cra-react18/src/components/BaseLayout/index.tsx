import { NavLink } from "react-router-dom";
import styled from "styled-components";
import IconSvg from "../IconSvg";
import BaseMenu from "./BaseMenu";
import logo from "@/assets/img/logo.png";
import { useIsAuthed } from "@/store/hooks/auth";

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

const BaseLayout = () => {
    const isAuthed = useIsAuthed();

    const onToggleMenu = () => {
        //
    };

    return (
        <section>
            <Header>
                <NavLink to="/">
                    <img src={logo} alt="logo" />
                </NavLink>
                <h3>一个坚持原创的前端分享驿站</h3>
                <HeaderIconWrapper>
                    <IconSvg icon="menu" title="打开菜单" onClick={onToggleMenu} />
                    {isAuthed ? (
                        <NavLink
                            to="/backend"
                            title="进入后台"
                            style={{
                                marginLeft: "8px",
                            }}
                        >
                            <IconSvg icon="admin" />
                        </NavLink>
                    ) : null}
                </HeaderIconWrapper>
            </Header>

            <BaseMenu />
        </section>
    );
};

export default BaseLayout;
