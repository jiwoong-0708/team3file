import React, { useEffect, useState } from "react";
import axios from "axios";
// axios 사용해봄 (json 자동변환)

function Admin() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // 현재 수정중인 상품
  const [form, setForm] = useState({
    p_name: "",
    price: "",
    stock: "",
    img_url: "",
    category: "",
    details: ""
  });

  // 상품 불러오기
  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:8080/admin/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 입력 변화
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 상품 추가
  const addProduct = async () => {
    await axios.post("http://localhost:8080/admin/products", form);
    alert("상품 추가 완료");
    setForm({ p_name: "", price: "", stock: "", img_url: "", category: "", details: "" });
    fetchProducts();
  };

  // 상품 수정 시작
  const startEdit = (product) => {
    setEditing(product.product_id);
    setForm({
        p_name: product.p_name || "",
        price: product.price || "",
        stock: product.stock || "",
        img_url: product.img_url || "",
        category: product.category || "",
        details: product.details || ""
    });
  };

  // 상품 수정 적용
  const updateProduct = async () => {
    await axios.put(`http://localhost:8080/admin/products/${editing}`, form);
    alert("상품 수정 완료");
    setEditing(null);
    setForm({
    p_name: "",
    price: "",
    stock: "",
    img_url: "",
    category: "",
    details: ""
  });
    fetchProducts();
  };

  // 상품 삭제
  const deleteProduct = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;

    await axios.delete(`http://localhost:8080/admin/products/${id}`);
    alert("삭제 완료");
    fetchProducts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>상품 관리</h1>

      {/* 상품 추가/수정 폼 */}
      <div style={{ marginBottom: "30px" }}>
        <h2>{editing ? "상품 수정" : "상품 추가"}</h2>

        <input name="p_name" placeholder="상품명" value={form.p_name} onChange={onChange} />
        <input name="price" placeholder="가격" value={form.price} onChange={onChange} />
        <input name="stock" placeholder="재고" value={form.stock} onChange={onChange} />
        <input name="img_url" placeholder="이미지 URL" value={form.img_url} onChange={onChange} />
        <select
        name="category"
        value={form.category}
        onChange={onChange}
        style={{ width: "200px", height: "30px", marginBottom: "10px" }}
        >
        <option value="">카테고리 선택</option>
        <option value="glasses">Glasses</option>
        <option value="sunglasses">Sunglasses</option>
        <option value="fashion">Fashion</option>
        <option value="sports">Sports</option>
        </select>
        <textarea name="details" placeholder="상품 설명" value={form.details} onChange={onChange}></textarea>

        <br />
        {editing ? (
          <button onClick={updateProduct}>수정 완료</button>
        ) : (
          <button onClick={addProduct}>상품 추가</button>
        )}
      </div>

      <hr />

      {/* 상품 목록 */}
      <h2>상품 목록</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>가격</th>
            <th>재고</th>
            <th>카테고리</th>
            <th>이미지</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              <td>{p.p_name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category}</td>
              <td><img src={p.img_url} width="60" alt="" /></td>
              <td>
                <button onClick={() => startEdit(p)}>수정</button>
                <button onClick={() => deleteProduct(p.product_id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Admin;
