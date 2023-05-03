import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import ScreenSizeDetector from 'ScreenSizeDetector'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ScreenSizeDetector>
      <App />
    </ScreenSizeDetector>
  </React.StrictMode>
)
