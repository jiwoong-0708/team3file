import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const cart = state?.cart || [];
  const totalPrice = state?.totalPrice || 0;

  const [form, setForm] = useState({
    recipient_name: "",
    recipient_phone: "",
    shipping_address: "",
    shipping_memo: "",
    payment_method: "카드"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ⭐ 결제 처리
  const handlePayment = async () => {
    // 결제 확인 창 추가
    const confirmPay = window.confirm("주문취소가 불가능한 상품입니다.\n그래도 결제하시겠습니까?");

    if (!confirmPay) {
      alert("결제가 취소되었습니다.");
      return; // ❗ 결제 중단
    }

    if (!form.recipient_name || !form.recipient_phone || !form.shipping_address) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          recipient_name: form.recipient_name,
          recipient_phone: form.recipient_phone,
          shipping_address: form.shipping_address,
          shipping_memo: form.shipping_memo,
          payment_method: form.payment_method,
          total_price: totalPrice,
          items: cart
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("결제가 완료되었습니다!");
        navigate("/mypage");
      } else {
        alert(data.message || "결제 실패");
      }
    } catch (error) {
      console.error(error);
      alert("서버 오류가 발생했습니다");
    }
  };

  return (
    <div className="payout-container" style={{ width: "70%", margin: "auto", padding: "20px" }}>
      <h2>결제 페이지</h2>
      <hr />

      <h3>🛒 주문 상품</h3>
      {cart.map(item => (
        <div
          key={item.cart_item_id}
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "15px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px"
          }}
        >
          <img src={item.img_url} width="80" alt="" />
          <div>
            <p><strong>{item.p_name}</strong></p>
            <p>수량: {item.quantity}</p>
            <p>₩{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        </div>
      ))}

      <h3>총 결제 금액: ₩{totalPrice.toLocaleString()}</h3>
      <hr />

      <h3>📦 배송 정보</h3>
      <div className="form-group">
        <label>수령인 *</label>
        <input
          type="text"
          name="recipient_name"
          value={form.recipient_name}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
        <label>연락처 *</label>
        <input
          type="text"
          name="recipient_phone"
          value={form.recipient_phone}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
        <label>배송지 *</label>
        <input
          type="text"
          name="shipping_address"
          value={form.shipping_address}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
        <label>배송 메모</label>
        <input
          type="text"
          name="shipping_memo"
          value={form.shipping_memo}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
        <label>결제 방식</label>
        <select
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
          className="input"
        >
          <option value="카드">카드 결제</option>
          <option value="무통장입금">무통장 입금</option>
          <option value="카카오페이">카카오페이</option>
          <option value="네이버페이">네이버페이</option>
        </select>
      </div>

      <button
        onClick={handlePayment}
        style={{
          marginTop: "20px",
          padding: "15px 25px",
          fontSize: "16px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        결제하기
      </button>
    </div>
  );
};

export default Payout;
