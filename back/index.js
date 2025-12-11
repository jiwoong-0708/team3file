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
            'SELECT user_id, name, role FROM users WHERE id=? AND pw=?',
            [id, pw]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: '로그인 실패' });
        }
       const user = {
            user_id: Number(rows[0].user_id),
            name: rows[0].name,
            role: rows[0].role
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
//--------------------------- 상품 검색 ---------------------------------
app.get("/search", async (req, res) => {
    const { keyword } = req.query;

    try {
        const rows = await pool.query(
            "SELECT * FROM products WHERE p_name LIKE ?",
            [`%${keyword}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "검색 실패" });
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


//-------------------- 유저 별 장바구니 조회 -----------------------------------
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
    // 1) 상품 재고 확인
    const [product] = await pool.query(
      "SELECT stock FROM products WHERE product_id = ?",
      [product_id]
    );

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    const stock = product.stock;

    // 2) 장바구니에 이미 있는지 확인
    const rows = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    const existing = rows[0]; // 있으면 객체, 없으면 undefined
    const currentQty = existing ? existing.quantity : 0;

    const newTotalQty = currentQty + quantity;

    // 3) 재고 초과 여부 검사
    if (newTotalQty > stock) {
      return res.status(400).json({
        message: `재고 부족: 최대 ${stock}개까지 담을 수 있습니다.`
      });
    }

    // 4) 기존 상품이면 수량 증가
    if (existing) {
      await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
        [newTotalQty, existing.cart_item_id]
      );

      return res.json({ message: "장바구니 수량이 증가되었습니다." });
    }

    // 5) 신규 추가
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
app.post('/orders', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const {
            user_id,
            recipient_name,
            shipping_address,
            recipient_phone,
            shipping_memo,
            total_price,
            payment_method,
            items // [{product_id, quantity, price}]
        } = req.body;

        await conn.beginTransaction();

        // 1) orders 테이블 생성
        const orderResult = await conn.query(
            `INSERT INTO orders 
            (user_id, recipient_name, shipping_address, recipient_phone, shipping_memo, total_price, status, payment_method)
            VALUES (?, ?, ?, ?, ?, ?, '상품 준비중', ?)`,
            [user_id, recipient_name, shipping_address, recipient_phone, shipping_memo, total_price, payment_method]
        );

        const order_id = orderResult.insertId;

        // 2) order_items 테이블 생성 + 재고 감소
        for (const item of items) {
            const { product_id, quantity, price } = item;

            // 주문 아이템 입력
            await conn.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                 VALUES (?, ?, ?, ?)`,
                [order_id, product_id, quantity, price]
            );

            // 재고 감소
            await conn.query(
                `UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?`,
                [quantity, product_id, quantity]
            );
        }
        // 주문 완료 후 장바구니 비우기
        await conn.query(
            `DELETE FROM cart_items WHERE user_id = ?`,
            [user_id]
        );

        await conn.commit();

        res.json({ message: "결제 완료!", order_id: Number(order_id) });

    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ message: "주문 처리 실패", error: err });
    } finally {
        conn.release();
    }
});
//---------------------유저 별 주문목록 조회-----------------------------
app.get('/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const rows = await pool.query(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );

        res.json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "주문 목록 조회 실패" });
    }
});
//----------------------특정 주문 상품목록 조회--------------------------
app.get('/orders/items/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const rows = await pool.query(
            `SELECT oi.*, p.p_name, p.img_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?`,
            [orderId]
        );

        res.json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "주문 상품 조회 실패" });
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
//-------------------관리자용 상품 목록 조회------------------------------
app.get('/admin/products', async (req, res) => {
    try {
        const rows = await pool.query(`
            SELECT product_id, p_name, price, stock, img_url, category, details
            FROM products
            ORDER BY product_id DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 조회 실패" });
    }
});

//-------------------관리자용 상품 상세 조회------------------------------
app.get('/admin/products/:id', async (req, res) => {
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "조회 실패" });
    }
});

//--------------------관리자용 상품 추가---------------------------------
app.post('/admin/products', async (req, res) => {
    const { p_name, price, stock, img_url, category, details } = req.body;

    try {
        await pool.query(
            `INSERT INTO products (p_name, price, stock, img_url, category, details)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [p_name, price, stock, img_url, category, details]
        );

        res.json({ message: "상품 추가 완료" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 추가 실패" });
    }
});

//--------------------관리자용 상품 수정---------------------------------
app.put('/admin/products/:id', async (req, res) => {
    const { id } = req.params;
    const { p_name, price, stock, img_url, category, details } = req.body;

    try {
        await pool.query(
            `UPDATE products 
             SET p_name=?, price=?, stock=?, img_url=?, category=?, details=?
             WHERE product_id=?`,
            [p_name, price, stock, img_url, category, details, id]
        );

        res.json({ message: "상품 수정 완료" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 수정 실패" });
    }
});
//--------------------관리자용 상품 삭제--------------------------------
app.delete('/admin/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM products WHERE product_id = ?", [id]);
        res.json({ message: "상품 삭제 완료" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상품 삭제 실패" });
    }
});
//----------------------관리자용 전제 주문 목록 조회--------------------------
app.get('/admin/orders', async (req, res) => {
    try {
        const rows = await pool.query(`
            SELECT order_id, user_id, total_price, status, created_at, recipient_name
            FROM orders
            ORDER BY created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "주문 조회 실패" });
    }
});
//----------------------관리자용 특정 주문 목록 조회--------------------------
app.get('/admin/orders/:orderId/items', async (req, res) => {
    const { orderId } = req.params;

    try {
        const rows = await pool.query(`
            SELECT oi.item_id, oi.quantity, oi.price_at_purchase,
                   p.p_name, p.img_url, p.category
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
        `, [orderId]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "주문 아이템 조회 실패" });
    }
});
//----------------------관리자용 주문 상태 변경--------------------------
app.put('/admin/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await pool.query(
            "UPDATE orders SET status=? WHERE order_id=?",
            [status, id]
        );

        res.json({ message: "주문 상태 변경 완료" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "상태 변경 실패" });
    }
});


//-------------------- 서버 실행 ---------------------------------------
app.listen(8080, () => {
    console.log('서버 실행: http://localhost:8080');
});
