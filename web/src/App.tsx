import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { ProductPage } from './pages/ProductPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PricingPage } from './pages/PricingPage';
import { AuthPage } from './pages/AuthPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage';
import { NotFoundPage } from './pages/NotFoundPage';

// New Grahak Contemporary Desi Art Flow & Features
import { GrahakEntryPage } from './pages/grahak/GrahakEntryPage';
import { GrahakLanguagePage } from './pages/grahak/GrahakLanguagePage';
import { GrahakLoginPage } from './pages/grahak/GrahakLoginPage';
import { GrahakSignUpPage } from './pages/grahak/GrahakSignUpPage';
import { GrahakOnboardingPage } from './pages/grahak/GrahakOnboardingPage';
import { GrahakSettingsPage } from './pages/grahak/GrahakSettingsPage';
import { GrahakFeaturesPage } from './pages/grahak/GrahakFeaturesPage';

// Auto-scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Authentication & Account Recovery Routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

          {/* Authenticated Operating System & Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/manager" element={<DashboardPage />} />
          <Route path="/dashboard/employee" element={<DashboardPage />} />
          
          {/* Workspace Module Routes */}
          <Route path="/dashboard/people" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/projects" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/accounting" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/crm" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/inventory" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/hr" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/documents" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/reports" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/compliance" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/settings" element={<ModulePlaceholderPage />} />
          <Route path="/dashboard/calendar" element={<ModulePlaceholderPage />} />

          {/* Grahak Contemporary Desi Art Flow & Features (Non-destructive extension) */}
          <Route path="/grahak" element={<GrahakEntryPage />} />
          <Route path="/grahak/welcome" element={<GrahakEntryPage />} />
          <Route path="/grahak/language" element={<GrahakLanguagePage />} />
          <Route path="/grahak/login" element={<GrahakLoginPage />} />
          <Route path="/grahak/signup" element={<GrahakSignUpPage />} />
          <Route path="/grahak/onboarding" element={<GrahakOnboardingPage />} />
          <Route path="/grahak/settings" element={<GrahakSettingsPage />} />
          <Route path="/grahak/features" element={<GrahakFeaturesPage />} />

          {/* 404 Dedicated Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
