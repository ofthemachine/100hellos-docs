import React from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import Header from './Header'
import Footer from './Footer'
import '../styles/global.css'

export default function Layout({ children }) {
  return (
    <ThemeProvider>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  )
}
