import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
// Pages
import DesignerDashboardPage from './pages/DesignerDashboardPage'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import LoginPage from './pages/LoginPage'
import PatternDetailPage from './pages/PatternDetailPage'
import AdminPage from './pages/AdminPage'
import UploadPatternPage from './pages/UploadPatternPage'
import UserAccountPage from './pages/UserAccountPage'
import AuthCallbackPage from './pages/AuthCallbackPage'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pattern/:id" element={<PatternDetailPage />} />
          <Route path="/account" element={<ProtectedRoute><UserAccountPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute allowedRoles={['designer', 'admin']}><UploadPatternPage /></ProtectedRoute>} />
          <Route path="/designer-dashboard" element={<ProtectedRoute allowedRoles={['designer', 'admin']}><DesignerDashboardPage /></ProtectedRoute>} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App