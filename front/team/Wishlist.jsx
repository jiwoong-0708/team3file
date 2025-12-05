import React from 'react'
import { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import '../src/App.css'

const Wishlist = () => {
  const products = [
    { id: 1, name: "상품명", price: "₩29,000", image: "../img/안경1.avif"},
    { id: 2, name: "상품명", price: "₩29,000", image: "../img/안경2.avif"},
    { id: 3, name: "상품명", price: "₩29,000", image: "../img/안경3.avif"},
  ];


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
            <div className="blank-div">
              <div className="product-grid1" onClick={() => navigate("/detail")}>
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.image} alt={item.name} className="product-img" />
            <p className="p-name">{item.name}</p>
            <p className="p-price">{item.price}</p>
          </div>
        ))}
      </div>

      </div>
      </div>
  )
}

export default Wishlist
