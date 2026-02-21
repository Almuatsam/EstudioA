import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Pages
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import LoginPage from './pages/LoginPage'
import PatternDetailPage from './pages/PatternDetailPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import UploadPatternPage from './pages/UploadPatternPage'

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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/upload" element={<UploadPatternPage />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App