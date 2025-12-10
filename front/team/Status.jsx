import React, { useEffect, useState } from "react";
import axios from "axios";

function Status() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:8080/admin/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (order_id, status) => {
    await axios.put(`http://localhost:8080/admin/orders/${order_id}/status`, { status });
    alert("상태 변경 완료!");
    fetchOrders();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>주문 관리</h1>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>주문ID</th>
            <th>고객ID</th>
            <th>총금액</th>
            <th>받는사람</th>
            <th>상태</th>
            <th>변경</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.order_id}>
              <td>{o.order_id}</td>
              <td>{o.user_id}</td>
              <td>{o.total_price}</td>
              <td>{o.recipient_name}</td>

              <td>{o.status}</td>

              <td>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.order_id, e.target.value)}
                >
                  <option value="상품 준비중">상품 준비중</option>
                  <option value="배송중">배송중</option>
                  <option value="배송완료">배송완료</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Status;
