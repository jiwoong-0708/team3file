import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  const inputdata = new URLSearchParams(location.search).get("keyword");

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!inputdata) return;

    fetch(`http://localhost:8080/search?keyword=${inputdata}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error(err));
  }, [inputdata]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔍 검색 결과: "{inputdata}"</h2>

      {results.length === 0 ? (
        <p>검색 결과 없음</p>
      ) : (
        results.map(item => (
          <div key={item.product_id} style={{ marginBottom: "20px" }}>
            <img src={item.img_url} width="150" alt="" />
            <h3>{item.p_name}</h3>
            <p>₩{item.price.toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Search;
