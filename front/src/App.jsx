import { useState } from 'react'
import { Route, Routes, BrowserRouter, Link, useNavigate } from 'react-router-dom'
import Home from '../team/Home.jsx'
import Detail from '../team/Detail.jsx'
import Login from '../team/Login.jsx'
import Mypage from '../team/Mypage.jsx'
import Admin from '../team/Admin.jsx'
import Status from '../team/Status.jsx'
import Register from '../team/Register.jsx'
import Wishlist from '../team/Wishlist.jsx'
import Fashion from '../team/Fashion.jsx'
import Glasses from '../team/Glasses.jsx'
import Sports from '../team/Spotrs.jsx'
import Sunglasses from '../team/Sunglasses.jsx'
import Search from '../team/Search.jsx'
import Payout from '../team/Payout.jsx'
import './App.css'

function App() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("")
    const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
    
  return (
       <div className="container">
    
        <nav className="header">
        <div className="hed-left">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
            placeholder="Search . . ." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?keyword=${keyword}`)
              }
            }}
            />
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
              localStorage.removeItem('adClosedAt');
              setUser(null);
              navigate('/');
            }}
            className="hed-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            로그아웃
          </button>
          {user.role === "admin" ? (
          <>
          <Link to="/admin" className="hed-link">상품관리</Link>
          <Link to="/status" className="hed-link">주문관리</Link>
          </>
          ):(
          <>
          <Link to="/mypage" className="hed-link"> 👤 </Link>
          <Link to="/wishlist" className="hed-link"> 🛒 </Link>
          </>)}
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
      <Route path="/admin" element={<Admin />}/>
      <Route path="/status" element={<Status />}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/wishlist' element={<Wishlist />}/>
      <Route path='/fashion' element={<Fashion />}/>
      <Route path='/glasses' element={<Glasses />}/>
      <Route path='/sports' element={<Sports />}/>
      <Route path='/sunglasses' element={<Sunglasses />}/>
      <Route path='/search' element={<Search />}/>
      <Route path="/payout" element={<Payout />}/>
    </Routes>
    
    <nav className="foot-container"> 

      <h3>상호명 : TEAM3(주)</h3>
      <h3>위치 : 병점역 노숙중</h3>
      <h3>INSTAGRAM : 평택유치원1짱정원준</h3>

    </nav>
    </div>
  )
}

export default App