import { RouterProvider } from "react-router-dom";
import { ConfigProvider, Skeleton } from "antd";
import { Provider } from "react-redux";
import { Suspense, useEffect } from "react";
import zhCN from "antd/locale/zh_CN";
import { store } from "./store";
import "dayjs/locale/zh-cn";
import { eventBus } from "./utils/eventbus";
import { router } from "./router";

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
        <Provider store={store}>
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
        </Provider>
    );
}

export default App;
