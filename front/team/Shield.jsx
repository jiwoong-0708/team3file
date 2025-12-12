import { Navigate } from "react-router-dom";

function Shield({ pass }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    alert("관리자 권한이 없습니다."); 
    return <Navigate to="/" replace />; // 일반 유저는 강제로 홈으로 이동
  }

  return pass; // 관리자는 패스
}

export default Shield;
