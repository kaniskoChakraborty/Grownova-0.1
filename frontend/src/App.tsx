import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ProductPage } from './pages/ProductPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PricingPage } from './pages/PricingPage';

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
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        {/* Fallback to landing page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
