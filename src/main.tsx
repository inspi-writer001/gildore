import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './index.css'
import App from './App.tsx'
import { PrivyAuthProvider } from './components/provider/PrivyProvider.tsx'
import { QueryProvider } from './components/provider/QueryProvider.tsx'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyAuthProvider>
      <QueryProvider>
        <ConvexProvider client={convex}>
          <App />
        </ConvexProvider>
      </QueryProvider>
    </PrivyAuthProvider>
  </StrictMode>,
)
