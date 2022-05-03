const path = require('path')
const express = require('express')
const hbs = require('hbs')
const mongoose = require('mongoose')
const postRouter = require('./routers/post')
const randomRouter = require('./routers/random')

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())

const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// register view engine
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

// データベース接続
mongoose
    .connect(
        'mongodb+srv://resonant:JTXB7ovGguJlcsnP@cluster0.ktf3y.mongodb.net/typing_game?retryWrites=true&w=majority'
    )
    .then(() => console.log('データベース接続に成功しました'))
    .catch(e => console.log(e))

// トップページ
app.get('/', (req, res) => {
    res.render('index', {})
})

// ルーティング
app.use('/posts', postRouter)
app.use(randomRouter)

app.listen(port, () => console.log('サーバーが起動しました'))
