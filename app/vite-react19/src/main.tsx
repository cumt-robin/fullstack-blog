import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.less'
import App from './App'
import { initDayjs } from '@fullstack-blog/utils'
import { useAxios } from "@fullstack-blog/services"
import { eventBus } from './utils/eventbus'
import { message } from 'antd'

initDayjs()

// eslint-disable-next-line react-hooks/rules-of-hooks
useAxios({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    onSessionInvalid: () => {
        eventBus.emit("sessionInvalid");
    },
    onErrorMsg: (msg) => {
        message.error(msg);
    },
})

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
