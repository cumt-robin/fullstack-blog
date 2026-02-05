import { Avatar, Dropdown, Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { navs, flatNavs } from "./navs";
import logo from "@/assets/img/logo.png";
import { useAuthStore } from "@/store";

const StyledLayout = styled(Layout)`
    height: 100%;

    .logo {
        max-width: 80%;
        height: 32px;
        display: block;
        margin: 16px auto;
    }

    .trigger {
        padding: 0 24px;
    }
`;

const MainLayout = styled(Layout)`
    > .ant-layout-header {
        background: rgb(255, 255, 255);
        padding: 0;
        .anticon {
            font-size: 18px;
            transition: color 0.3s;
            &:hover {
                color: #1890ff;
            }
        }

        .admin-avatar {
            color: #1890ff;
            background-color: rgb(253, 227, 207);
            float: right;
            margin-right: 24px;
            margin-top: 16px;
        }
    }

    .ant-layout-content {
        padding: 20px;
        background-color: #f5f5f5;
        overflow: auto;
    }
`;

const Component = () => {
    const location = useLocation();

    const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>([]);

    const [collapsed, setCollapsed] = useState(false);

    const selectedKeys = useMemo(() => [location.pathname], [location.pathname]);

    const navigate = useNavigate();

    const dispatchLogout = useAuthStore((state) => state.dispatchLogout);

    const calcOpenKeys = (): string[] => {
        const activeNav = flatNavs.find((item) => item.key === location.pathname);
        return (activeNav?.parentKeys as string[]) || [];
    };

    useEffect(() => {
        setMenuOpenKeys(collapsed ? [] : calcOpenKeys());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collapsed, location.pathname]);

    const toggleMenu = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
    };

    const onSiderCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    };

    const onClickMenu = ({ key }: { key: string }) => {
        navigate(key);
    };

    const handleDropdownMenuClick = async ({ key }: { key: string }) => {
        switch (key) {
            case "write":
                navigate("/backend/write");
                break;
            case "logout":
                await dispatchLogout();
                navigate("/");
                break;
            default:
                break;
        }
    };

    const goHome = () => {
        navigate("/");
    };

    return (
        <StyledLayout>
            <Layout.Sider trigger={null} collapsed={collapsed} collapsible breakpoint="lg" onCollapse={onSiderCollapse}>
                <img src={logo} className="logo" alt="logo" />
                <Menu
                    mode="inline"
                    theme="dark"
                    openKeys={menuOpenKeys}
                    selectedKeys={selectedKeys}
                    onOpenChange={(openKeys) => setMenuOpenKeys(openKeys)}
                    onClick={onClickMenu}
                >
                    {navs.map((sub) => (
                        <Menu.SubMenu
                            key={sub.key}
                            title={
                                <span>
                                    {sub.icon}
                                    <span>{sub.title}</span>
                                </span>
                            }
                        >
                            {sub.children.map((child) => (
                                <Menu.Item key={child.key}>{child.title}</Menu.Item>
                            ))}
                        </Menu.SubMenu>
                    ))}
                </Menu>
            </Layout.Sider>
            <MainLayout>
                <Layout.Header>
                    {collapsed ? (
                        <MenuUnfoldOutlined className="trigger" onClick={toggleMenu} />
                    ) : (
                        <MenuFoldOutlined className="trigger" onClick={toggleMenu} />
                    )}
                    <HomeOutlined onClick={goHome} />

                    <Dropdown
                        menu={{
                            items: [
                                { label: "开始创作", key: "write" },
                                { label: "退出登录", key: "logout" },
                            ],
                            onClick: handleDropdownMenuClick,
                        }}
                    >
                        <Avatar className="admin-avatar">T</Avatar>
                    </Dropdown>
                </Layout.Header>
                <Layout.Content>
                    <Outlet />
                </Layout.Content>
            </MainLayout>
        </StyledLayout>
    );
};

export default Component;
