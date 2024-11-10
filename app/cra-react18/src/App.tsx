import { RouterProvider } from "react-router-dom";
import { ConfigProvider, Skeleton } from "antd";
import { Provider } from "react-redux";
import { Suspense } from "react";
import zhCN from "antd/locale/zh_CN";
import { router } from "./router";
import { store } from "./store";
import "dayjs/locale/zh-cn";

function App() {
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
