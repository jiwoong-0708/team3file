import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import '../src/App.css'


const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);

  const [index, setIndex] = useState(0);

  const nextSlide = () => {
  if (slides.length === 0) return;   // 슬라이드 준비 전 실행 방지
  setIndex(prev => (prev + 1) % slides.length);
};

const prevSlide = () => {
  if (slides.length === 0) return;
  setIndex(prev => (prev - 1 + slides.length) % slides.length);
};

useEffect(() => {
  if (slides.length === 0) return;

  const interval = setInterval(() => {
    nextSlide();
  }, 3000);

  return () => clearInterval(interval);
}, [index, slides]);

  // DB에서 상품 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/products");
        const data = await res.json();
        setProducts(data);

        // product.img_url을 슬라이드용 배열에 넣기
        const bannerImgs = data.map(p => p.img_url);
        setSlides(bannerImgs);

      } catch (err) {
        console.error(err);
        alert("상품을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>

      

      {/* 슬라이드 배너 */}
      <div className="wrap">
      <div className="slider">
        <div
          className="slide-track"
          style={{ transform: `translateX(-${index * 1000}px)` }}
        >
          {slides.map((img, i) => (
            <div className="slide" key={i}>
              <img src={img} alt={`banner-${i}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="btn-box">
        <button onClick={prevSlide}>◀</button>
        <button onClick={nextSlide}>▶</button>
      </div>
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
