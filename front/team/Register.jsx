import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import '../src/App.css'

const Register = () => {
  const navigate = useNavigate();

  // ⭐ 상태값 추가 (프론트 입력값 관리)
  const [form, setForm] = useState({
    id: '',
    pw: '',
    pwCheck: '',
    name: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ⭐ 회원가입 요청 함수
  const registerleshgo = async () => {
    if (!form.id || !form.pw || !form.name || !form.address) {
      return alert("필수 값을 모두 입력해주세요.");
    }

    if (form.pw !== form.pwCheck) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    if (form.id.length < 4) {
      return alert("ID는 최소 4글자 이상이어야 합니다.");
    }

    if (form.pw.length < 8) {
      return alert("비밀번호는 최소 6글자 이상이어야 합니다.");
    }

    try {
      const res = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.id,
          pw: form.pw,
          name: form.name,
          address: form.address,
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`회원가입 성공!`);
        navigate('/login');
      } else {
        alert(data.message || "회원가입 실패");
      }

    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="container">
      {/*상단 헤더부분 */}
      <nav className="header">
        <div className="hed-left">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input placeholder="Search . . ." />
          </div>
          <div className="category">
            <Link to="/glasses">Glasses</Link>
            <span> | </span>
            <Link to="/sunglasses">SunGlasses</Link>
            <span> | </span>
            <Link to="/sports">Sports</Link>
            <span> | </span>
            <Link to="/fashion">Fashion</Link>
          </div>
        </div>

        <div className="hed-center"> ------ Name ------ </div>

        <div className="hed-right">
          <Link to="/login" className="hed-link">Login</Link>
          <span> | </span>
          <Link to="/register" className="hed-link">Sign up</Link>
          <Link to="/mypage" className="hed-link"> 👤 </Link>
          <Link to="/wishlist" className="hed-link"> 🛒 </Link>
        </div>
      </nav>

      <div className="blank-div">
        <div className="login1-div">
          <h2>Sign Up</h2>
          <h3>Member Information</h3>

          <div className="input-box"><label className="input-label">ID :</label><input name="id" value={form.id} onChange={handleChange} type="text" /></div>
          <div className="input-box"><label className="input-label">Password :</label><input name="pw" value={form.pw} onChange={handleChange} type="password" /></div>
          <div className="input-box"><label className="input-label">Check the Password :</label><input name="pwCheck" value={form.pwCheck} onChange={handleChange} type="password" /></div>
          <div className="input-box"><label className="input-label">Name :</label><input name="name" value={form.name} onChange={handleChange} type="text" /></div>
          <div className="input-box"><label className="input-label">Adress :</label><input name="address" value={form.address} onChange={handleChange} type="text" /></div>

          {/* ⭐ 등록 버튼 */}
          <button onClick={registerleshgo} className="submit-btn">Accession</button>
        </div>
      </div>
    </div>
  );
}

export default Register;
