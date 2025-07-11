
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
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

const queryClient = new QueryClient();

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
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
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
