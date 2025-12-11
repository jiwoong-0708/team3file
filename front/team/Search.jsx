import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("keyword");

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    fetch(`http://192.168.0.221:8080/search?keyword=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error(err));
  }, [query]);

  return (
    <div className="search-container">
      <h2 className="search-title">🔍 검색 결과: "{query}"</h2>

      {results.length === 0 ? (
        <p>검색 결과 없음</p>
      ) : (
        results.map((item) => (
          <div
            key={item.product_id}
            className="search-result-card"
            onClick={() => navigate(`/detail/${item.product_id}`)}
          >
            <img src={item.img_url} alt={item.p_name} />
            <h3>{item.p_name}</h3>
            <p>₩{item.price.toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Search;
