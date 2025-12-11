import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../src/App.css";

const Detail = () => {
  const { id } = useParams(); // URL에서 product_id 가져오기
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // 상품 상세 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://192.168.0.221:8080/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        alert("상품 정보를 불러오는 중 오류 발생");
      }
    };

    fetchProduct();
  }, [id]);

  // 상품 장바구니에 추가
const addToCart = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  if (!user_id) {
    alert("로그인이 필요합니다.");
    navigate("/login");
    return;
  }

  // 프론트에서 재고 체크
  if (product.stock <= 0) {
    alert("품절된 상품입니다.");
    return;
  }

  try {
    const res = await fetch("http://192.168.0.221:8080/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(user_id),
        product_id: Number(product.product_id),
        quantity: 1
      })
    });

    const data = await res.json();

    // 백엔드 재고 검사 실패 시 메시지 출력
    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);

  } catch (err) {
    console.error(err);
    alert("장바구니 추가 실패");
  }
};

  if (!product) return <div className="loading">상품 정보를 불러오는 중...</div>;

  return (
    <div>
      

      <div className="detail-content">
        {/* 상품 이미지 */}
        <img src={product.img_url} alt={product.p_name} className="detail-img" />

        <div className="detail-info">
          <h2>{product.p_name}</h2>
          <p className="detail-price">₩{product.price.toLocaleString()}</p>
          <p className="detail-stock">재고: {product.stock} 개</p>
          <p className="detail-desc">{product.details}</p>

          <div className="detail-buttons">
            <button className="detail-btn" onClick={addToCart}>장바구니 추가</button>
            <button
              className="detail-btn detail-back"
              onClick={() => navigate("/")}
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
