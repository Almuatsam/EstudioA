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

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

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
          <Route path="/account" element={<UserAccountPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/upload" element={<UploadPatternPage />} />
          <Route path="/designer-dashboard" element={<DesignerDashboardPage />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App