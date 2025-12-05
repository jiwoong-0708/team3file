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

//-------------------- 상품 조회 ---------------------------------------
app.get('/products', async (req, res) => {
    try {
        const products = await pool.query('SELECT * FROM products');
        res.json(fixBigInt(products));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '상품 조회 실패' });
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
app.post('/cart', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [user_id, product_id, quantity]
        );
        res.json({
            message: '장바구니 추가 성공',
            cart_item_id: Number(result.insertId)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '장바구니 추가 실패' });
    }
});

//-------------------- 서버 실행 ---------------------------------------
app.listen(8080, () => {
    console.log('서버 실행: http://localhost:8080');
});
