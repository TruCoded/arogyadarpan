import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen as CapSplashScreen } from '@capacitor/splash-screen'
import { LanguageProvider } from './context/LanguageContext'

// Pages
import LandingPage from './pages/LandingPage'
import DemoPage from './pages/DemoPage'
import KioskView from './components/KioskView'

// Patient Journey
import SplashScreen from './pages/patient/SplashScreen'
import LanguageSelection from './pages/patient/LanguageSelection'
import ConsentScreen from './pages/patient/ConsentScreen'
import PatientIdentification from './pages/patient/PatientIdentification'
import InterviewScreen from './pages/patient/InterviewScreen'
import DocumentUpload from './pages/patient/DocumentUpload'
import DocumentReview from './pages/patient/DocumentReview'
import ConfirmationScreen from './pages/patient/ConfirmationScreen'
import CompletionScreen from './pages/patient/CompletionScreen'
import PatientDashboard from './pages/patient/PatientDashboard'

// Doctor Dashboard
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import PatientDetail from './pages/doctor/PatientDetail'

function MobileAppController() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Configure Native Mobile Status Bar & Splash Screen
    if (Capacitor.isNativePlatform()) {
      StatusBar.setBackgroundColor({ color: '#00685f' }).catch(() => {})
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
      StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {})
      CapSplashScreen.hide().catch(() => {})

      // Handle Android Hardware Back Button
      const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
        if (location.pathname === '/' || location.pathname === '/kiosk') {
          // If at root or kiosk, minimize/exit app
          CapApp.exitApp()
        } else if (canGoBack) {
          navigate(-1)
        } else {
          navigate('/')
        }
      })

      return () => {
        backListener.then(handle => handle.remove()).catch(() => {})
      }
    }
  }, [location, navigate])

  return null
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <>
      <MobileAppController />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* App Launch Splash & Landing */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/kiosk" element={<KioskView />} />

          {/* Patient Journey */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/patient/splash" element={<SplashScreen />} />
          <Route path="/patient/language" element={<LanguageSelection />} />
          <Route path="/patient/consent" element={<ConsentScreen />} />
          <Route path="/patient" element={<PatientIdentification />} />
          <Route path="/patient/identification" element={<Navigate to="/patient" replace />} />
          <Route path="/patient/register" element={<Navigate to="/patient" replace />} />
          <Route path="/patient/login" element={<Navigate to="/patient" replace />} />
          <Route path="/patient/interview" element={<InterviewScreen />} />
          <Route path="/patient/history" element={<Navigate to="/patient/interview" replace />} />
          <Route path="/patient/documents" element={<DocumentUpload />} />
          <Route path="/patient/upload" element={<Navigate to="/patient/documents" replace />} />
          <Route path="/patient/document-review" element={<DocumentReview />} />
          <Route path="/patient/timeline" element={<Navigate to="/patient/document-review" replace />} />
          <Route path="/patient/confirmation" element={<ConfirmationScreen />} />
          <Route path="/patient/complete" element={<CompletionScreen />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />

          {/* Doctor Dashboard */}
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<Navigate to="/doctor" replace />} />
          <Route path="/doctor/patient" element={<Navigate to="/doctor" replace />} />
          {/* Support both singular /doctor/patient/:id and plural /doctor/patients/:id */}
          <Route path="/doctor/patient/:id" element={<PatientDetail />} />
          <Route path="/doctor/patient/:id/timeline" element={<PatientDetail />} />
          <Route path="/doctor/patient/:id/documents" element={<PatientDetail />} />
          <Route path="/doctor/patient/:id/review" element={<PatientDetail />} />
          <Route path="/doctor/patients/:id" element={<PatientDetail />} />
          <Route path="/doctor/patients/:id/timeline" element={<PatientDetail />} />
          <Route path="/doctor/patients/:id/documents" element={<PatientDetail />} />
          <Route path="/doctor/patients/:id/review" element={<PatientDetail />} />

          {/* Catch-all Wildcard Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </LanguageProvider>
  )
}


