import React from 'react'
import '../src/App.css'

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
  return (

    <div className="container">

     {/*상단 헤더부분 */}
    
    <nav className="header">
        <div className="hed-left">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input placeholder="Search . . ." />
          </div>
          <div className="category">카테고리 | 더보기</div>
        </div>
        
        <div className="hed-center"> ------ Name ------ </div>

        <div className="hed-right">
          <span>Login</span>
          <span> | </span>
          <span>Sign up</span>
          <span> 👤 </span>
          <span> 🛒 </span>
        </div>
      </nav>

    <div>
      {/* 사진슬라이드베너 div */}
    </div>


      {/* 베스트 상품 div  */}
      <h2 className="best-title">───────────────── Best Product ─────────────────</h2>

      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <div className="product-img" />
            <p className="p-name">{item.name}</p>
            <p className="p-price">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home
