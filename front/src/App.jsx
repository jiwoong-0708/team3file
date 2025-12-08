import { useState } from 'react'
import { Route, Routes, BrowserRouter, Link} from 'react-router-dom'
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
       <div className="container">
    <BrowserRouter>

        <nav className="header">
        <div className="hed-left">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input placeholder="Search . . ." />
          </div>
          <div className="category">
            <Link to="/glasses">Glasses</Link>
            <span> | </span>
            <Link to="/sunglasses">SunGlasses</Link>
            <span> | </span>
            <Link to="/sports">Sports</Link>
            <span> | </span>
            <Link to="/fashion">Fashion</Link>
          </div>
        </div>

        <div className="hed-center"><Link to="/">Taco Tuseday</Link></div>

        <div className="hed-right">
          {/* 로그인 상태 따라 표시 변경 */}
        {user ? (
          <>
          <span className="hed-link">{user.name}님</span>
          <span> | </span>
          <button
              onClick={() => {
              localStorage.removeItem('user');
              setUser(null);
              navigate('/');
            }}
            className="hed-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            로그아웃
          </button>
          <Link to="/mypage" className="hed-link"> 👤 </Link>
          <Link to="/wishlist" className="hed-link"> 🛒 </Link>
        </>
      ) : (
        <>
          <Link to="/login" className="hed-link">Login</Link>
          <span> | </span>
          <Link to="/register" className="hed-link">Sign up</Link>
          <Link to="/mypage" className="hed-link"> 👤 </Link>
          <Link to="/wishlist" className="hed-link"> 🛒 </Link>
        </>
      )}

        </div>
      </nav>

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
    </div>
  )
}

export default App
