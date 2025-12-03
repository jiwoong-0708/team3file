import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import '../src/App.css'
import suneye1 from '../img/선글라스메인베너.png'

// 임시 상품 이름, 가격

const products = [
    { id: 1, name: "상품명", price: "₩29,000" },
    { id: 2, name: "상품명", price: "₩29,000" },
    { id: 3, name: "상품명", price: "₩29,000" },
    { id: 4, name: "상품명", price: "₩29,000" },
    { id: 5, name: "상품명", price: "₩29,000" },
    { id: 6, name: "상품명", price: "₩29,000" },
    { id: 7, name: "상품명", price: "₩29,000" },
    { id: 8, name: "상품명", price: "₩29,000" },
  ];

const Home = () => {
      const navigate = useNavigate();

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

      {/* 사진슬라이드베너 div */}

    <div className="banner">
      <img src={suneye1} alt="product" />
    </div>


      {/* 베스트 상품 div  */}
      <div className="under-product">
      <h2 className="best-title">───────────────── Best Product ─────────────────</h2>

      <div className="product-grid" onClick={() => navigate("/detail")}>
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <div className="product-img" />
            <p className="p-name">{item.name}</p>
            <p className="p-price">{item.price}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default Home
