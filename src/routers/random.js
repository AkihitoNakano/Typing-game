const { Router } = require('express')
const Word = require('../models/word')
const router = Router()

const wordsNumber = 5

async function getNumbers(count) {
    let numbersEl = []
    while (true) {
        const randomNumber = Math.floor(Math.random() * count)
        if (numbersEl.length < wordsNumber) {
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
    if (!req.query.language) {
        return res.status(404).send({
            error: 'You must provide a language term',
        })
    }
    try {
        const language = req.query.language
        let words
        if (language === 'all') {
            words = await Word.find({})
        } else {
            const lang = await Word.find({ language: language })
            const common = await Word.find({ language: 'common' })
            words = lang.concat(common)
        }
        const count = words.length - 1

        const randomNumbers = await getNumbers(count)
        const randomWords = await getRandomWords(randomNumbers, words)
        res.send(randomWords)
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
