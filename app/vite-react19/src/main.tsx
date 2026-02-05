import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.less'
import App from './App'
import { init } from '@/utils/date-utils'

init()

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
