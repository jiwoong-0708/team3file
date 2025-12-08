import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../src/App.css";

const Detail = () => {
  const { id } = useParams(); // URL에서 product_id 가져오기
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // 상품 상세 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        alert("상품 정보를 불러오는 중 오류 발생");
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="loading">상품 정보를 불러오는 중...</div>;

  return (
    <div>
      

      <div className="detail-content">
        {/* 상품 이미지 */}
        <img src={product.img_url} alt={product.p_name} className="detail-img" />

        <div className="detail-info">
          <h2>{product.p_name}</h2>
          <p className="detail-price">₩{product.price.toLocaleString()}</p>
          <p className="detail-desc">{product.details}</p>

          <div className="detail-buttons">
            <button className="detail-btn">장바구니 추가</button>
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
