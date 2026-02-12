import { RouterProvider } from "react-router-dom";
import { ConfigProvider, Skeleton } from "antd";
import { Suspense, useEffect } from "react";
import zhCN from "antd/locale/zh_CN";
import { router } from "./router";
import "dayjs/locale/zh-cn";
import { eventBus } from "./utils/eventbus";

function App() {
    useEffect(() => {
        const handleSessionInvalid = () => {
            router.navigate("/login");
        };

        eventBus.on("sessionInvalid", handleSessionInvalid);
        return () => {
            eventBus.off("sessionInvalid", handleSessionInvalid);
        };
    }, []);

    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                token: {
                    colorPrimary: "#008dff",
                    colorLink: "#87b4e2",
                    colorLinkHover: "#6d9ccd",
                },
            }}
        >
            <Suspense fallback={<Skeleton />}>
                <RouterProvider router={router} />
            </Suspense>
        </ConfigProvider>
    );
}

export default App;
