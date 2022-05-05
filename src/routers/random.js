const { Router } = require('express')
const Word = require('../models/word')
const router = Router()

const wordsNumber = 20

async function getNumbers(count) {
    let numbersEl = []
    while (true) {
        const randomNumber = Math.floor(Math.random() * count)
        if (numbersEl.length <= wordsNumber) {
            if (!numbersEl.includes(randomNumber)) {
                numbersEl.push(randomNumber)
            } else {
                continue
            }
        } else {
            break
        }
    }

    return numbersEl
}

async function getRandomWords(randomNumbers, words) {
    randomWords = []
    randomNumbers.forEach(randomNumber => {
        const group = {
            word: words[randomNumber].word,
            score: words[randomNumber].score,
        }
        randomWords.push(group)
    })
    return randomWords
}

router.get('/random', async (req, res) => {
    try {
        const count = await Word.countDocuments({})
        const words = await Word.find()

        const randomNumbers = await getNumbers(count)
        const randomWords = await getRandomWords(randomNumbers, words)
        res.send(randomWords)
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
