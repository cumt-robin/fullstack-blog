import ReactDOM from "react-dom/client";
import "./styles/main.less";
import { useAxios } from "@fullstack-blog/services";
import { message } from "antd";
import { initDayjs } from "@fullstack-blog/utils";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { eventBus } from "./utils/eventbus";

initDayjs();
// eslint-disable-next-line react-hooks/rules-of-hooks
useAxios({
    baseURL: process.env.REACT_APP_BASE_API,
    onSessionInvalid: () => {
        eventBus.emit("sessionInvalid");
    },
    onErrorMsg: (msg) => {
        message.error(msg);
    },
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
