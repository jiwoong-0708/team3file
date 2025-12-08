import React from 'react'
import { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import '../src/App.css'

const Mypage = () => {

const [cart, setCart] = useState([]);

const addProduct = () => {
    const newProduct = {
      id: cart.length + 1,
      img: "https://via.placeholder.com/80", // 임시 이미지
      name: `상품 ${cart.length + 1}`,
      price: 12000 + cart.length * 1000,
      qty: 1,
      status: "배송 준비중"
    };

    setCart([...cart, newProduct]);
  };

  return (

    <div>

 
            <div className="blank-div">
              <div className="container1">
      <button className="add-btn" onClick={addProduct}>
        상품 추가
      </button>
      <span className="jumun"><h2>나의 주문내역</h2></span>

      <div className="cart-list">
        {cart.map((item) => (
          <div key={item.id} className="cart-card">
            
            {/* 상품 이미지 */}
            <img src={item.img} alt="상품" className="cart-img" />

            {/* 상품명 */}
            <div className="cart-block border-right">
              <p className="cart-name">{item.name}</p>
            </div>

            {/* 가격 */}
            <div className="cart-block border-right">
              <p className="cart-price">가격 : {item.price}원</p>
            </div>

            {/* 수량 */}
            <div className="cart-block border-right">
              <p className="cart-123">주문수량 : {item.qty}개</p>
            </div>

            {/* 배송 현황 */}
            <div className="cart-block">
              <p className="cart-quick">{item.status}</p>
            </div>

          </div>
        ))}
      </div>

      </div>
      </div>
      </div>
  )
}

export default Mypage