import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, Skeleton } from 'antd'
import { Suspense } from 'react'
import zhCN from 'antd/locale/zh_CN'
import { router } from './router'
import 'dayjs/locale/zh-cn'

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#008dff',
          colorLink: '#87b4e2',
          colorLinkHover: '#6d9ccd',
        },
      }}
    >
      <Suspense fallback={<Skeleton />}>
        <RouterProvider router={router} />
      </Suspense>
    </ConfigProvider>
  )
}

export default App
