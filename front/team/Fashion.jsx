import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Fashion = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFashion = async () => {
      try {
        const res = await fetch("http://192.168.0.221:8080/products?category=fashion");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        alert("상품을 불러오지 못했습니다.");
      }
    };

    fetchFashion();
  }, []);

  return (
    <div className="category-container">
      <h2>Fashion Glasses</h2>

      <div className="product-list">
        {products.length === 0 ? (
          <p>상품이 없습니다.</p>
        ) : (
          products.map((product) => (
            <div key={product.product_id} className="product-card2">
              <Link to={`/detail/${product.product_id}`}>
                <img src={product.img_url} alt={product.p_name} />
                <h3>{product.p_name}</h3>
                <p>₩{product.price.toLocaleString()}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Fashion;
