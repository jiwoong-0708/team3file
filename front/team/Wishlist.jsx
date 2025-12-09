import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:8080/cart/${user.user_id}`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        alert("장바구니 정보를 불러오지 못했습니다.");
      }
    };

    fetchCart();
  }, []);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  //  결제 페이지로 이동
  const handlePay = () => {
    navigate("/payout", { 
      state: {
        cart: items,
        totalPrice: totalPrice
      }
    });
  };

  const deleteItem = async (cart_item_id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch("http://localhost:8080/cart/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_item_id })
      });

      const data = await res.json();

      if (res.ok) {
        alert("삭제되었습니다.");
        setItems(items.filter(item => item.cart_item_id !== cart_item_id));
      } else {
        alert(data.message || "삭제 실패");
      }
    } catch (error) {
      console.error(error);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="cart-container">
      <h2>장바구니</h2>

      {items.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        items.map((item) => (
          <div key={item.cart_item_id} className="cart-item">
            <img src={item.img_url} alt={item.p_name} className="cart-img" />
            <div className="cart-info">
              <h3>{item.p_name}</h3>
              <p>₩{item.price.toLocaleString()}</p>
              <p>수량: {item.quantity}</p>
              <p>합계: ₩{(item.price * item.quantity).toLocaleString()}</p>
            </div>

            <button
              className="delete-btn"
              onClick={() => deleteItem(item.cart_item_id)}
            >
              삭제
            </button>
          </div>
        ))
      )}

      <hr />
      <h3>총 금액: ₩{totalPrice.toLocaleString()}</h3>

      {items.length > 0 && (
        <button className="pay-btn" onClick={handlePay}>
          결제하기
        </button>
      )}
    </div>
  );
};

export default Wishlist;
