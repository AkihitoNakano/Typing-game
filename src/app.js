const path = require('path')
const express = require('express')
require('./db/mongoose')
const hbs = require('hbs')
const userRouter = require('./routers/user')
const postRouter = require('./routers/word_router')
const randomRouter = require('./routers/random')

const port = process.env.PORT

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

// トップページ
app.get('/', (req, res) => {
    res.render('index', {})
})

// ルーティング
app.use('/users', userRouter)
app.use('/words', postRouter)
app.use(randomRouter)

app.listen(port, () => console.log('サーバーが起動しました'))
