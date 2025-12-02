const express = require('express')
const cors = require('cors')
const pool = require('./db')
const app = express();
app.use(express.json());
app.use(cors());

app.get('/',async(req,res)=>{
    const user = await pool.query('SELECT * FROM user')
    res.send(user)
})

app.listen(8080, ()=>{
    console.log("서버 실행")
})