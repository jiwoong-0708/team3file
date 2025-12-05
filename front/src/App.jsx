import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from '../team/Home.jsx'
import Detail from '../team/Detail.jsx'
import Login from '../team/Login.jsx'
import Mypage from '../team/Mypage.jsx'
import Register from '../team/Register.jsx'
import Wishlist from '../team/Wishlist.jsx'
import Fashion from '../team/Fashion.jsx'
import Glasses from '../team/Glasses.jsx'
import Sports from '../team/Spotrs.jsx'
import Sunglasses from '../team/Sunglasses.jsx'
import './App.css'

function App() {
    const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/detail/:id' element={<Detail />}/>
      <Route path='/login' element={<Login user={user} setUser={setUser} />}/>
      <Route path='/mypage' element={<Mypage />}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/wishlist' element={<Wishlist />}/>
      <Route path='/fashion' element={<Fashion />}/>
      <Route path='/glasses' element={<Glasses />}/>
      <Route path='/sports' element={<Sports />}/>
      <Route path='/sunglasses' element={<Sunglasses />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
