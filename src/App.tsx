import React, { useEffect, useState } from 'react';
import { useSelector, Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { store, RootState } from './lib/store';
import { initializeDatabase } from './lib/db/initialize';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Maintenance from './pages/Maintenance';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

const AppContent = () => {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const { theme } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  
  useEffect(() => {
    initializeDatabase()
      .then(() => setDbInitialized(true))
      .catch(error => {
        console.error('Database initialization failed:', error);
        setDbError('Failed to initialize the application. Please try again later.');
      });
  }, []);

  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{dbError}</p>
        </div>
      </div>
    );
  }

  if (!dbInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className={theme}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/properties" element={<Properties />} />
                      <Route path="/tenants" element={<Tenants />} />
                      <Route path="/maintenance" element={<Maintenance />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;