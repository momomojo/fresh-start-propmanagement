import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthErrorBoundary } from './components/auth/AuthErrorBoundary';
import { store } from '@/lib/store';
import { AuthProvider } from './providers/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { RoleBasedRoute } from './components/auth/RoleBasedRoute';
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
import Unauthorized from './pages/Unauthorized';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <ErrorBoundary>
          <AuthErrorBoundary>
            <AuthProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<EmailVerification />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route
                              path="/properties"
                              element={
                                <RoleBasedRoute allowedRoles={['admin', 'property_manager']}>
                                  <Properties />
                                </RoleBasedRoute>
                              }
                            />
                            <Route
                              path="/tenants"
                              element={
                                <RoleBasedRoute allowedRoles={['admin', 'property_manager']}>
                                  <Tenants />
                                </RoleBasedRoute>
                              }
                            />
                            <Route path="/maintenance" element={<Maintenance />} />
                            <Route path="/documents" element={<Documents />} />
                            <Route
                              path="/reports"
                              element={
                                <RoleBasedRoute allowedRoles={['admin', 'property_manager']}>
                                  <Reports />
                                </RoleBasedRoute>
                              }
                            />
                            <Route path="/settings" element={<Settings />} />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </AuthProvider>
          </AuthErrorBoundary>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;