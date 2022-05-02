const path = require('path')
const express = require('express')
const hbs = require('hbs')
const mongoose = require('mongoose')
const wordModel = require('./models/word')

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
    res.render(index, {})
})

// データの取得
app.get('/posts', async (req, res) => {
    const words = await wordModel.find({})

    try {
        res.send(words)
    } catch (e) {
        res.status(500).send(err)
    }
})

// 単語データの作成
app.post('/posts', async (req, res) => {
    const word = new wordModel(req.body)

    try {
        await word.save()
        res.send(word)
    } catch (err) {
        res.status(500).send(err)
    }
})

app.listen(port, () => console.log('サーバーが起動しました'))
