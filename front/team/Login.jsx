import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import '../src/App.css'

const Login = () => {
  return (
  <div className="container">

     {/*상단 헤더부분 */}
    
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
        
        <div className="hed-center"> ------ Name ------ </div>

        <div className="hed-right">
          <Link to="/login" className="hed-link">Login</Link>
          <span> | </span>
          <Link to="/register" className="hed-link">Sign up</Link>
          <Link to="/mypage" className="hed-link"> 👤 </Link>
          <Link to="/wishlist" className="hed-link"> 🛒 </Link>
        </div>
      </nav>
        <div className="blank-div">
        <div className="login-div">
          <h2>Login Page</h2>
          
          <input type="text" placeholder="ID를 입력하세요." />
          <input type="password" placeholder="Password를 입력하세요." />

          <h1><Link to="/">Login</Link></h1>
        </div>
      </div>
      </div>


  );
}

export default Login
