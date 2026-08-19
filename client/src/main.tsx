import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

const splash = document.getElementById('app-splash')
if (splash) {
  document.documentElement.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    splash.classList.add('app-splash--hide')
    window.setTimeout(() => {
      splash.remove()
      document.documentElement.style.overflow = ''
    }, 350)
  })
}
