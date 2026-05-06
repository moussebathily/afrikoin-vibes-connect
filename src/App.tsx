import React, { lazy, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AppProviders } from '@/components/providers/AppProviders'
import { AppLayout } from '@/components/layout/AppLayout'
import { LazyRoute } from '@/components/layout/LazyRoute'
import { ROUTES } from '@/config/routes'
import { HomePage } from '@/pages/HomePage'
import { AuthPage } from '@/pages/AuthPage'
import { Toaster } from '@/components/ui/toaster'
import { SEOHead } from '@/components/seo/SEOHead'
import { setupI18n } from '@/i18n/config'
// @ts-ignore - CSS import handled by Vite
import './index.css'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

// Lazy load all non-critical routes to keep initial bundle minimal
const WalletPage = lazy(() => import('@/pages/WalletPage').then(m => ({ default: m.WalletPage })))
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })))
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })))
const CulturePage = lazy(() => import('@/pages/CulturePage').then(m => ({ default: m.CulturePage })))
const SportsPage = lazy(() => import('@/pages/SportsPage').then(m => ({ default: m.SportsPage })))
const RankingsPage = lazy(() => import('@/pages/RankingsPage').then(m => ({ default: m.RankingsPage })))
const MarketsPage = lazy(() => import('@/pages/MarketsPage').then(m => ({ default: m.MarketsPage })))
const CallPage = lazy(() => import('@/pages/CallPage').then(m => ({ default: m.CallPage })))
const TrackingPage = lazy(() => import('@/pages/TrackingPage').then(m => ({ default: m.TrackingPage })))
const JobsPage = lazy(() => import('@/pages/JobsPage').then(m => ({ default: m.JobsPage })))
const JobDetailPage = lazy(() => import('@/pages/JobDetailPage').then(m => ({ default: m.JobDetailPage })))
const NewsPage = lazy(() => import('@/pages/NewsPage').then(m => ({ default: m.NewsPage })))
const AIStudioDemo = lazy(() => import('@/components/ai/AIStudioDemo').then(m => ({ default: m.AIStudioDemo })))
const MarketplacePage = lazy(() => import('@/pages/MarketplacePage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const SellerPage = lazy(() => import('@/pages/SellerPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const TransportPage = lazy(() => import('@/pages/TransportPage'))
const AdminTransportPage = lazy(() => import('@/pages/AdminTransportPage'))
const MyRentalsPage = lazy(() => import('@/pages/MyRentalsPage'))
const TabaskiPage = lazy(() => import('@/pages/TabaskiPage'))
const MyTabaskiReservationsPage = lazy(() => import('@/pages/MyTabaskiReservationsPage'))
const StationsPage = lazy(() => import('@/pages/StationsPage'))
const WallpapersPage = lazy(() => import('@/pages/WallpapersPage'))
const MessagingPage = lazy(() => import('@/pages/MessagingPage'))
const SellerPremiumPage = lazy(() => import('@/pages/SellerPremiumPage'))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse" />
      </div>
    )
  }
  return user ? <>{children}</> : <Navigate to={ROUTES.AUTH} replace />
}

function App() {
  const [i18nReady, setI18nReady] = useState(false)
  useNetworkStatus() // Global online/offline notifications

  useEffect(() => {
    setupI18n().then(() => setI18nReady(true))
  }, [])

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      try {
        StatusBar.setOverlaysWebView({ overlay: true })
        StatusBar.setBackgroundColor({ color: '#00000000' })
        const applyStyle = () => {
          const isDark = document.documentElement.classList.contains('dark')
          StatusBar.setStyle({ style: isDark ? Style.Light : Style.Dark })
        }
        applyStyle()
        const observer = new MutationObserver(applyStyle)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      } catch (e) { /* ignore */ }
    }
  }, [])

  if (!i18nReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <AppProviders>
      <Router>
        <div className="min-h-screen bg-background">
          <SEOHead />
          <Routes>
            <Route path={ROUTES.AUTH} element={<AuthPage />} />
            <Route path={ROUTES.HOME} element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<HomePage />} />
              <Route path="culture" element={<LazyRoute><CulturePage /></LazyRoute>} />
              <Route path="sports" element={<LazyRoute><SportsPage /></LazyRoute>} />
              <Route path="markets" element={<LazyRoute><MarketsPage /></LazyRoute>} />
              <Route path="rankings" element={<LazyRoute><RankingsPage /></LazyRoute>} />
              <Route path="wallet" element={<LazyRoute><WalletPage /></LazyRoute>} />
              <Route path="call" element={<LazyRoute><CallPage /></LazyRoute>} />
              <Route path="tracking" element={<LazyRoute><TrackingPage /></LazyRoute>} />
              <Route path="jobs" element={<LazyRoute><JobsPage /></LazyRoute>} />
              <Route path="jobs/:id" element={<LazyRoute><JobDetailPage /></LazyRoute>} />
              <Route path="news" element={<LazyRoute><NewsPage /></LazyRoute>} />
              <Route path="transport" element={<LazyRoute><TransportPage /></LazyRoute>} />
              <Route path="admin/transport" element={<LazyRoute><AdminTransportPage /></LazyRoute>} />
              <Route path="my-rentals" element={<LazyRoute><MyRentalsPage /></LazyRoute>} />
              <Route path="tabaski" element={<LazyRoute><TabaskiPage /></LazyRoute>} />
              <Route path="my-tabaski-reservations" element={<LazyRoute><MyTabaskiReservationsPage /></LazyRoute>} />
              <Route path="marketplace" element={<LazyRoute><MarketplacePage /></LazyRoute>} />
              <Route path="product/:id" element={<LazyRoute><ProductDetailPage /></LazyRoute>} />
              <Route path="ai-studio" element={<div className="p-4"><LazyRoute><AIStudioDemo /></LazyRoute></div>} />
              <Route path="seller/premium" element={<LazyRoute><SellerPremiumPage /></LazyRoute>} />
              <Route path="seller/:sellerId?" element={<LazyRoute><SellerPage /></LazyRoute>} />
              <Route path="checkout" element={<LazyRoute><CheckoutPage /></LazyRoute>} />
              <Route path="stations" element={<LazyRoute><StationsPage /></LazyRoute>} />
              <Route path="profile" element={<div className="p-8 text-center">Page Profil - En construction</div>} />
              <Route path="likes" element={<div className="p-8 text-center">Page Likes - En construction</div>} />
              <Route path="holidays" element={<div className="p-8 text-center">Page Fêtes - En construction</div>} />
              <Route path="about" element={<LazyRoute><AboutPage /></LazyRoute>} />
              <Route path="fonds-ecran" element={<LazyRoute><WallpapersPage /></LazyRoute>} />
              <Route path="messages" element={<LazyRoute><MessagingPage /></LazyRoute>} />
              <Route path="payment-success" element={<LazyRoute><PaymentSuccessPage /></LazyRoute>} />
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AppProviders>
  )
}

export default App
