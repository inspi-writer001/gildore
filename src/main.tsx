import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrivyAuthProvider } from './components/provider/PrivyProvider.tsx'
import { QueryProvider } from './components/provider/QueryProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyAuthProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </PrivyAuthProvider>
  </StrictMode>,
)
