import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../src/App.css'

const Login = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: '', pw: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loginleshgo = async () => {
    if (!form.id || !form.pw) {
      return alert("ID와 비밀번호를 입력해주세요.");
    }

    try {
      const res = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: form.id, pw: form.pw })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user); // 로그인 상태 변경
        alert(`${data.user.name}님 어서오세요.`);
        navigate('/');
      } else {
        alert(data.message || "ID와 비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.log(err);
      alert("서버 오류 발생");
    }
  };

  return (
    <div>
      

      <div className="blank-div">
        <div className="login-div">
          <h2>Login Page</h2>

          <input
            type="text"
            placeholder="ID를 입력하세요."
            name="id"
            value={form.id}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password를 입력하세요."
            name="pw"
            value={form.pw}
            onChange={handleChange}
          />

          <button onClick={loginleshgo} className="submit-btn">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
