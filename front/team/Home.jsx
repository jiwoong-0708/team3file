import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import '../src/App.css'
import suneye1 from '../img/선글라스메인베너.png'

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // DB에서 상품 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        alert("상품을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">

      {/* 헤더 */}
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

      {/* 슬라이드 배너 */}
      <div className="banner">
        <img src={suneye1} alt="banner" />
      </div>

      {/* 상품 리스트 */}
      <div className="under-product">
        <h2 className="best-title">───────────────── Best Product ─────────────────</h2>

        <div className="product-grid">
          {products.map((item) => (
            <div
              className="product-card"
              key={item.product_id}
              onClick={() => navigate(`/detail/${item.product_id}`)}
            >
              <img
                src={item.img_url}
                alt={item.p_name}
                className="product-img"
              />

              <p className="p-name">{item.p_name}</p>
              <p className="p-price">₩{item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;
