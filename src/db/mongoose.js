const mongoose = require('mongoose')

// データベース接続
mongoose
    .connect(
        'mongodb+srv://resonant:JTXB7ovGguJlcsnP@cluster0.ktf3y.mongodb.net/typing_game?retryWrites=true&w=majority'
    )
    .then(() => console.log('データベース接続に成功しました'))
    .catch(e => console.log(e))
