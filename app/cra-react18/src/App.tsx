import { RouterProvider } from "react-router-dom";
import { ConfigProvider, Skeleton } from "antd";
import { Provider } from "react-redux";
import { Suspense } from "react";
import router from "./router";
import { store } from "./store";

function App() {
    return (
        <Provider store={store}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#008dff",
                        colorLink: "#87b4e2",
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
