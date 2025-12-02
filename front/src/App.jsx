import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />}/>
      <>
      나는 백이야
      </>
    </Routes>
    </BrowserRouter>
  )
}

export default App
