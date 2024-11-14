import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import { lazy, PropsWithChildren } from "react";
import Home from "@/views/Home";
import { useIsAuthed } from "@/store/hooks/auth";

const Category = lazy(() => import("../views/Category/index"));

const Backend = lazy(() => import("../views/Backend/index"));

const AuthGuard: React.FC<PropsWithChildren> = ({ children }) => {
    const isAuthed = useIsAuthed();
    if (!isAuthed) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/category/:name",
        element: <Category />,
    },
    {
        path: "/categories",
        lazy: () => import("../views/Categoryies"),
    },
    {
        path: "/tags",
        lazy: () => import("../views/Tags"),
    },
    {
        path: "/tag/:name",
        lazy: () => import("../views/Tag"),
    },
    {
        path: "/messages",
        lazy: () => import("../views/Messages"),
    },
    {
        path: "/timeline",
        lazy: () => import("../views/Timeline"),
    },
    {
        path: "/article/:id",
        lazy: () => import("../views/Article"),
    },
    {
        path: "/login",
        lazy: () => import("../views/Login"),
    },
    {
        path: "/chat",
        lazy: () => import("../views/Chat"),
    },
    {
        path: "/backend",
        element: (
            <AuthGuard>
                <Backend />
            </AuthGuard>
        ),
        children: [
            {
                path: "",
                element: <Navigate to="article" replace />,
            },
            {
                path: "article",
                lazy: () => import("../views/Backend/Article"),
            },
            {
                path: "write",
                lazy: () => import("../views/Backend/Write"),
            },
            {
                path: "article/edit/:id",
                lazy: () => import("../views/Backend/Write"),
            },
            {
                path: "category",
                lazy: () => import("../views/Backend/Category"),
            },
            {
                path: "tag",
                lazy: () => import("../views/Backend/Tag"),
            },
            {
                path: "all-msg",
                lazy: () => import("../views/Backend/Message/All"),
            },
            {
                path: "all-comment",
                lazy: () => import("../views/Backend/Comment/All"),
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
