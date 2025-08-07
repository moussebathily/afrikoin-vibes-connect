import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { AuthPage } from '@/pages/AuthPage'
import { WalletPage } from '@/pages/WalletPage'
import { setupI18n } from '@/i18n/config'
import { useEffect, useState } from 'react'
import './index.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse" />
      </div>
    )
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />
}

function App() {
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    setupI18n().then(() => {
      setI18nReady(true)
    })
  }, [])

  if (!i18nReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="profile" element={<div className="p-8 text-center">Page Profil - En construction</div>} />
              <Route path="likes" element={<div className="p-8 text-center">Page Likes - En construction</div>} />
              <Route path="holidays" element={<div className="p-8 text-center">Page Fêtes - En construction</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App