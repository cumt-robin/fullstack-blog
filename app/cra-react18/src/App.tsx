import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import router from "./router";

function App() {
    return (
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
    );
}

export default App;
