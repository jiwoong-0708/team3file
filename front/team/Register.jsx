import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import '../src/App.css'

const Register = () => {
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
              <div className="login1-div">
                <h2>Sign Up</h2>
                <h3>Member Information</h3>
                
                
                <div class="input-box"><label className="input-label">ID :</label><input type="text"/></div>
                <div class="input-box"><label className="input-label">Password :</label><input type="password"/></div>
                <div class="input-box"><label className="input-label">Check the Password :</label><input type="password"/></div>
                <div class="input-box"><label className="input-label">Name or Nickname:</label><input type="text"/></div>
                <div class="input-box"><label className="input-label">Adress :</label><input type="text"/></div>

                <h1><Link to="/Login">Accession</Link></h1>
              </div>
            </div>
    </div>
  )
}

export default Register