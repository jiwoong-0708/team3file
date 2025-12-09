import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import '../src/App.css'

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);

  const [index, setIndex] = useState(1); 
  const [transition, setTransition] = useState("transform 1s ease");

  const nextSlide = () => {
    if (slides.length === 0) return;
    setIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setIndex(prev => prev - 1);
  };

  // ⭐ 무한 루프 처리
 useEffect(() => {
  if (slides.length < 2) return;

  // 마지막 더미 도착
  if (index === slides.length - 1) {
    setTimeout(() => {
      setTransition("none"); // 순간 이동
      setIndex(1);

      // ⭐ transition 복구 (즉시)
      setTimeout(() => {
        setTransition("transform 1s ease");
      }, 20);   // 20ms 지연 → 브라우저가 transition 변화를 감지할 수 있도록
    }, 1000);
  }

  // 첫 번째 더미 도착
  if (index === 0) {
    setTimeout(() => {
      setTransition("none"); // 순간 이동
      setIndex(slides.length - 2);

      // ⭐ transition 복구
      setTimeout(() => {
        setTransition("transform 1s ease");
      }, 20);
    }, 1000);
  }
}, [index, slides]);

  // 자동 슬라이드
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  // 상품/슬라이드 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/products");
        const data = await res.json();
        setProducts(data);

        const imgs = data.map(p => p.img_url);

        // ⭐ 무한 슬라이드용 더미 추가
        setSlides([imgs[imgs.length - 1], ...imgs, imgs[0]]);
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
            style={{
              transform: `translateX(-${index * 1000}px)`,
              transition: transition
            }}
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
