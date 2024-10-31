import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Home from "@/views/Home";

const Category = lazy(() => import("../views/Category/index"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/categories",
        lazy: () => import("../views/Categoryies"),
    },
    {
        path: "/category/:name",
        element: <Category />,
    },
    {
        path: "/tags",
        lazy: () => import("../views/Tags"),
    },
]);

export default router;
