import './App.css'
import React from 'react'
import { ThemeProvider } from './contexts/useTheme'
import Placements from './components/Placements'
import { AuthProvider } from './contexts/useAuth'
import {Toaster} from 'react-hot-toast'


const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Placements/>
        <Toaster/>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App