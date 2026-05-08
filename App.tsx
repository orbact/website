import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Solutions = lazy(() => import('./pages/Solutions'));
const SolutionDetail = lazy(() => import('./pages/SolutionDetail'));
const Works = lazy(() => import('./pages/Works'));
const Pricing = lazy(() => import('./pages/Pricing'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg-page text-accent-primary">
    <div className="animate-pulse text-xl font-mono">INITIALIZING...</div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ToastProvider>
          <Router>
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/solutions" element={<Solutions />} />
                  <Route path="/solutions/:id" element={<SolutionDetail />} />
                  <Route path="/works" element={<Works />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </ToastProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;