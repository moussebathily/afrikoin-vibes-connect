
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSafeArea } from "./hooks/useSafeArea";
import { useAuth } from "./hooks/useAuth";
import { ErrorBoundary } from "./components/ui/error-boundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import FinTech from "./pages/FinTech";
import Education from "./pages/Education";
import Entertainment from "./pages/Entertainment";
import Subscription from "./pages/Subscription";
import Services from "./pages/Services";
import CreatorEconomy from "./pages/CreatorEconomy";
import Analytics from "./pages/Analytics";
import { Greetings } from "./pages/Greetings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) return false;
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Public Route component (redirect to home if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

const App = () => {
  const { safeAreaClasses, isEdgeToEdge } = useSafeArea();
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className={`min-h-screen ${isEdgeToEdge ? safeAreaClasses : ''}`}>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute><Marketplace language="fr" /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile language="fr" /></ProtectedRoute>} />
                <Route path="/fintech" element={<ProtectedRoute><FinTech language="fr" /></ProtectedRoute>} />
                <Route path="/education" element={<ProtectedRoute><Education language="fr" /></ProtectedRoute>} />
                <Route path="/entertainment" element={<ProtectedRoute><Entertainment language="fr" /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute><Subscription language="fr" /></ProtectedRoute>} />
                <Route path="/services" element={<ProtectedRoute><Services language="fr" /></ProtectedRoute>} />
                <Route path="/creators" element={<ProtectedRoute><CreatorEconomy language="fr" /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics language="fr" /></ProtectedRoute>} />
                <Route path="/greetings" element={<ProtectedRoute><Greetings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
