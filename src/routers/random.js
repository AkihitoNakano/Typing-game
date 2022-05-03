const { Router } = require('express')
const Word = require('../models/word')
const router = Router()

// awaitで計算する前にconsole.log文が出力されてしまう
router.get('/random', async (req, res) => {
    const count = await Word.countDocuments({})
    const words = await Word.find()
    const randomNumber = Math.floor(Math.random * count)
    console.log(randomNumber)
    console.log(words[randomNumber])
})

module.exports = router
