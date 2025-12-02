import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from '../team/Home.jsx'
import Detail from '../team/Detail.jsx'
import Login from '../team/Login.jsx'
import Mypage from '../team/Mypage.jsx'
import Register from '../team/Register.jsx'
import Wishlist from '../team/Wishlist.jsx'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/detail' element={<Detail />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/mypage' element={<Mypage />}/>
      <Route path='/register' element={<Regiter />}/>
      <Route path='/wishlist' element={<Wishlist />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
