import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function Shield({ children }) {
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.role === "admin") {
      // 관리자 → 정상 접근
      setIsAdmin(true);
      setChecked(true);
    } else {
      // 관리자가 아님 → alert 후 차단
      alert("관리자 권한이 없습니다.");
      setIsAdmin(false);
      setChecked(true);
    }
  }, []);

  // 아직 권한 체크 안끝났을 때 빈 화면 유지
  if (!checked) return <div style={{ padding: 20 }}>Loading...</div>;

  // 권한 없음 → 홈으로 이동
  if (!isAdmin) return <Navigate to="/" replace />;

  // 관리자 → 정상 렌더링
  return children;
}

export default Shield;
