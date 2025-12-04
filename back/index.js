const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(express.json());
app.use(cors());

//--------------------회원조회---------------------------------------
app.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT user_id, id, name, address, created_at FROM users');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '회원 조회 실패' }); // json형태로 front에 메세지를 보냄
    }                                                       // 프론트에서 alert(json받은변수.message) 하면 메세지 출력됨 
});

//--------------------회원가입---------------------------------------
app.post('/users', async (req, res) => {
    const { id, pw, name, address } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO users (id, pw, name, address) VALUES (?, ?, ?, ?)',
            [id, pw, name, address]
        );
        res.json({ message: '회원가입 성공', user_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '회원가입 실패', error: err });
    }
});

//--------------------회원 로그인-------------------------------------
app.post('/login', async (req, res) => {
    const { id, pw } = req.body;
    try {
        const [rows] = await pool.query('SELECT user_id, name FROM users WHERE id=? AND pw=?', [id, pw]);
        if (rows.length === 0) return res.status(401).json({ message: '로그인 실패' });
        res.json({ message: '로그인 성공', user: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '로그인 오류' });
    }
});

//--------------------상품 조회---------------------------------------
app.get('/products', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '상품 조회 실패' });
    }
});

//--------------------장바구니 조회-----------------------------------
app.get('/cart/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const [cartItems] = await pool.query(
            `SELECT ci.cart_item_id, ci.quantity, p.product_id, p.p_name, p.price 
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.product_id
             WHERE ci.user_id = ?`,
            [user_id]
        );
        res.json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '장바구니 조회 실패' });
    }
});

//--------------------장바구니 추가-----------------------------------
app.post('/cart', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [user_id, product_id, quantity]
        );
        res.json({ message: '장바구니 추가 성공', cart_item_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '장바구니 추가 실패' });
    }
});

//--------------------장바구니 삭제-----------------------------------
app.delete('/cart/:cart_item_id', async (req, res) => {
    const { cart_item_id } = req.params;
    try {
        await pool.query('DELETE FROM cart_items WHERE cart_item_id = ?', [cart_item_id]);
        res.json({ message: '장바구니 삭제 성공' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '장바구니 삭제 실패' });
    }
});

//--------------------주문 생성---------------------------------------
app.post('/orders', async (req, res) => {
    const { user_id, recipient_name, shipping_address, recipient_phone, shipping_memo } = req.body;
    // pool.getConnection : db 와 연결 / 트랜젝션 사용(주문 후 장바구니 상품제거)을 위해 연결을 고정함 
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [orderResult] = await conn.query(
            'INSERT INTO orders (user_id, recipient_name, shipping_address, recipient_phone, shipping_memo) VALUES (?, ?, ?, ?, ?)',
            [user_id, recipient_name, shipping_address, recipient_phone, shipping_memo]
        );
        const order_id = orderResult.insertId;  // 주문 id값 가져오기

        // ci.product_id 중에 (ci. : cart_items. 
        const [cartItems] = await conn.query(
            'SELECT ci.product_id, ci.quantity, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.product_id WHERE ci.user_id = ?',
            [user_id]
        );

        if (cartItems.length === 0) throw new Error('장바구니에 상품이 없습니다.');

        let totalPrice = 0; // 총가격변수
        for (let item of cartItems) {
            const priceAtPurchase = item.price;
            totalPrice += priceAtPurchase * item.quantity;

            await conn.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [order_id, item.product_id, item.quantity, priceAtPurchase]
            );

            await conn.query(
                'UPDATE products SET stock = stock - ? WHERE product_id = ?',
                [item.quantity, item.product_id]
            );
        }

        await conn.query('UPDATE orders SET total_price = ? WHERE order_id = ?', [totalPrice, order_id]);
        await conn.query('DELETE FROM cart_items WHERE user_id = ?', [user_id]);

        await conn.commit();
        res.json({ message: '주문 완료', order_id });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ message: '주문 실패', error: err.message });
    } finally {
        conn.release();
    }
});

//--------------------주문 조회---------------------------------------
app.get('/orders/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [user_id]
        );

        for (let order of orders) {
            const [items] = await pool.query(
                `SELECT oi.item_id, oi.product_id, p.p_name, oi.quantity, oi.price_at_purchase 
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.product_id
                 WHERE oi.order_id = ?`,
                [order.order_id]
            );
            order.items = items;
        }

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '주문 조회 실패' });
    }
});

//--------------------서버 실행---------------------------------------
app.listen(8080, () => {
    console.log('서버 실행: http://localhost:8080');
});
