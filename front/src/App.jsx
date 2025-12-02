import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />}/>
      <>
      나는 프런트
      </>
    </Routes>
    </BrowserRouter>
  )
}

export default App
