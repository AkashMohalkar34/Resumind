import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Root from './pages/Root'
import About from './pages/About'
import Serivces from './pages/Serivces'
import Contact from './pages/Contact'
import GenerateResume from './pages/GenerateResume'
import ATSResumeAnalyzer from './pages/ATSResumeAnalyzer'
import JobMatcher from './pages/JobMatcher'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import PublicAuthRoute from './components/PublicAuthRoute'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>

      <Toaster />
      <Routes>
        <Route path='/' element={<Root />} >
          <Route index element={<Navigate to="/login" replace />} />
          <Route path='home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='about' element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path='services' element={<ProtectedRoute><Serivces /></ProtectedRoute>} />
          <Route path='contact' element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path='generate-resume' element={<ProtectedRoute><GenerateResume /></ProtectedRoute>} />
          <Route path='ats-check' element={<ProtectedRoute><ATSResumeAnalyzer /></ProtectedRoute>} />
          <Route path='job-matcher' element={<ProtectedRoute><JobMatcher /></ProtectedRoute>} />
          <Route path='login' element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
        </Route>


      </Routes>


    </BrowserRouter>


)
