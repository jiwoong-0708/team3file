const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(express.json());
app.use(cors());

// 🔥 BigInt → Number 변환 함수
function fixBigInt(obj) {
    return JSON.parse(
        JSON.stringify(
            obj,
            (key, value) => (typeof value === 'bigint' ? Number(value) : value)
        )
    );
}

//-------------------- 회원 조회 ---------------------------------------
app.get('/users', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json(fixBigInt(users)); // 🔥 BigInt 제거
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '회원 조회 실패' });
    }
});

//-------------------- 회원가입 ---------------------------------------
app.post('/users', async (req, res) => { 
    const { id, pw, name, address } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (id, pw, name, address) VALUES (?, ?, ?, ?)',
            [id, pw, name, address]
        );

        res.json({
            message: '회원가입 성공',
            user_id: Number(result.insertId)   // 🔥 BigInt → Number
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '회원가입 실패', error: err });
    }
});

//-------------------- 로그인 ---------------------------------------
app.post('/login', async (req, res) => {
    const { id, pw } = req.body;
    try {
        const rows = await pool.query(
            'SELECT user_id, name FROM users WHERE id=? AND pw=?',
            [id, pw]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: '로그인 실패' });
        }
       const user = {
            user_id: Number(rows[0].user_id),
            name: rows[0].name
        };
        res.json({
            message: '로그인 성공',
            user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '로그인 오류' });
    }
});

//-------------------- 상품 조회 + 카테고리 필터 -------------------------
app.get('/products', async (req, res) => {
    const { category } = req.query;

    try {
        let sql = "SELECT * FROM products";
        let params = [];

        if (category) {
            sql += " WHERE category = ?";
            params.push(category);
        }

        const products = await pool.query(sql, params);

        res.json(fixBigInt(products));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '상품 조회 실패' });
    }
});



//--------------------상세페이지 조회-----------------------------------
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await pool.query(
      "SELECT * FROM products WHERE product_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "상품 없음" });
    }

    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


//-------------------- 장바구니 조회 -----------------------------------
app.get('/cart/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const cartItems = await pool.query(
            `SELECT ci.cart_item_id, ci.quantity, 
                    p.product_id, p.p_name, p.price, p.img_url 
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.product_id
             WHERE ci.user_id = ?`,
            [user_id]
        );
        res.json(fixBigInt(cartItems));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '장바구니 조회 실패' });
    }
});

//-------------------- 장바구니 추가 -----------------------------------
app.post('/cart/add', async (req, res) => { 
    const { user_id, product_id, quantity } = req.body;

    try {
        // mariadb는 destructuring 사용 X
        const rows = await pool.query(
            "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        // 이미 상품 있음 → 수량 증가
        if (rows.length > 0) {
            await pool.query(
                "UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?",
                [quantity, rows[0].cart_item_id]   // ← 여기 수정
            );
            return res.json({ message: "수량이 증가되었습니다." });
        }

        // 신규 추가
        await pool.query(
            "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
            [user_id, product_id, quantity]
        );

        res.json({ message: "장바구니에 추가되었습니다." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "장바구니 추가 실패", error });
    }
});
// --------------------장바구니 결제-------------------------------------
app.post("/order/create", async (req, res) => {
    const { user_id } = req.body;

    try {
        // 1. 장바구니 목록 가져오기
        const cartItems = await pool.query(
            "SELECT * FROM cart_items WHERE user_id = ?",
            [user_id]
        );

        if (cartItems.length === 0)
            return res.status(400).json({ message: "장바구니가 비어있습니다." });

        // 총액 계산
        const total = cartItems.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);

        // 2. orders 테이블 insert
        const orderResult = await pool.query(
            "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
            [user_id, total]
        );

        const order_id = orderResult.insertId;

        // 3. order_items insert
        for (let item of cartItems) {
            await pool.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                [order_id, item.product_id, item.quantity, item.price]
            );
        }

        // 4. 장바구니 비우기
        await pool.query("DELETE FROM cart_items WHERE user_id = ?", [user_id]);

        res.json({ message: "결제 완료!", order_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "결제 실패" });
    }
});

//----------------------장바구니 상품 삭제 ------------------------------
app.delete('/cart/delete', async (req, res) => {
    const { cart_item_id } = req.body;

    try {
        const result = await pool.query(
            "DELETE FROM cart_items WHERE cart_item_id = ?",
            [cart_item_id]
        );

        res.json({ message: "장바구니에서 삭제되었습니다." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "삭제 실패", error });
    }
});


//-------------------- 서버 실행 ---------------------------------------
app.listen(8080, () => {
    console.log('서버 실행: http://localhost:8080');
});
