import React, { useEffect, useState } from "react";

const Mypage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // ------------------------------
  // 1) 유저 주문 목록 불러오기
  // ------------------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8080/orders/${user.user_id}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        alert("주문 목록을 불러오지 못했습니다.");
      }
    };

    fetchOrders();
  }, []);

  // ------------------------------
  // 2) 주문 상품 상세 불러오기
  // ------------------------------
  const loadOrderItems = async (orderId) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
      setOrderItems([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/orders/items/${orderId}`);
      const data = await res.json();

      setSelectedOrderId(orderId);
      setOrderItems(data);
    } catch (err) {
      console.error(err);
      alert("주문 상세를 불러오지 못했습니다.");
    }
  };

  return (
    <div className="mypage-container" style={{ padding: "20px" }}>
      <h2>마이페이지</h2>
      
      <h3>📦 주문 내역</h3>

      {orders.length === 0 ? (
        <p>주문한 상품이 없습니다.</p>
      ) : (
        orders.map(order => (
          <div 
            key={order.order_id}
            onClick={() => loadOrderItems(order.order_id)}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
              cursor: "pointer",
              background: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <h3>주문번호 #{order.order_id}</h3>

            <p><strong>상태:</strong> {order.status}</p>
            <p><strong>총 금액:</strong> ₩{order.total_price.toLocaleString()}</p>
            <p><strong>주문일:</strong> {order.created_at?.slice(0, 19)}</p>

            {selectedOrderId === order.order_id && (
              <div style={{ marginTop: "15px", paddingLeft: "10px" }}>
                <h4>🛒 주문 상품 목록</h4>

                {orderItems.map(item => (
                  <div 
                    key={item.item_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "10px"
                    }}
                  >
                    <img 
                      src={item.img_url}
                      alt={item.p_name}
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", marginRight: "15px" }}
                    />
                    <div>
                      <p><strong>{item.p_name}</strong></p>
                      <p>가격: ₩{item.price_at_purchase.toLocaleString()}</p>
                      <p>수량: {item.quantity}개</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Mypage;
