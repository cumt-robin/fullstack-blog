import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
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
                <RouterProvider router={router} />
            </ConfigProvider>
        </Provider>
    );
}

export default App;
