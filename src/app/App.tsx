import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { UserRankingPage } from './pages/UserRankingPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { RequestPaperPage } from './pages/RequestPaperPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PaperManagementPage } from './pages/PaperManagementPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { PaperDetailPage } from './pages/PaperDetailPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<UserDashboard />} />} />
        <Route path="/my-requests" element={<ProtectedRoute element={<MyRequestsPage />} />} />
        <Route path="/rankings" element={<ProtectedRoute element={<UserRankingPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<UserProfilePage />} />} />
        <Route path="/request-paper" element={<ProtectedRoute element={<RequestPaperPage />} />} />
        <Route
          path="/admin"
          element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
        />
        <Route
          path="/admin/papers"
          element={<ProtectedRoute element={<PaperManagementPage />} requiredRole="admin" />}
        />
        <Route
          path="/admin/users"
          element={<ProtectedRoute element={<UserManagementPage />} requiredRole="admin" />}
        />
        <Route path="/paper/:id" element={<ProtectedRoute element={<PaperDetailPage />} />} />
      </Routes>
    </Router>
  );
}