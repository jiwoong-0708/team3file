// db.js
const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,    // localhost
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,    // root
    password: process.env.DB_PASS,// root
    database: process.env.DB_NAME,// sample
    connectionLimit: 5            // 동시에 5개 커넥션 가능
});

pool.getConnection()
    .then(conn => {
        console.log('✅ DB 연결 성공');
        conn.release(); // 사용 후 반드시 release
    })
    .catch(err => {
        console.error('❌ DB 연결 실패:', err);
    });

module.exports = pool;
