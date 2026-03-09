import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SellerDashboard from './pages/SellerDashboard';
import TicketFormPage from './pages/TicketFormPage';
import TicketPreviewPage from './pages/TicketPreviewPage';
import AdminDashboard from './pages/AdminDashboard';
import QRScannerPage from './pages/QRScannerPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Seller Routes */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/new-ticket"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <TicketFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/ticket/:id"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <TicketPreviewPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/scanner"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <QRScannerPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
