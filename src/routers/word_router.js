const { Router } = require('express')
const Word = require('../models/word')
const auth = require('../middleware/auth')

const router = Router()

// GET words
// GET /words?lang=javascript
// GET /words?score=1
// GET /words?sortBy=createAt:asc
router.get('/', auth, async (req, res) => {
    const tag = req.query.lang
    const match = {}

    console.log(tag, req.body)

    // if (tag === req.bo)

    try {
        const words = await Word.find({})
        const count = await Word.countDocuments({})
        console.log('document counts => ' + count)
        res.send(words)
    } catch (e) {
        res.sendStatus(500).send(e)
    }
})

// Post a word
router.post('/', async (req, res) => {
    const word = new Word(req.body)
    try {
        await word.save()
        res.send(word)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Update
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['word', 'score', 'language']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Contain some invalid words' })
    }

    try {
        const word = await Word.findById(req.params.id)
        updates.forEach(update => (word[update] = req.body[update]))

        await word.save()

        if (!word) {
            return res.sendStatus(404)
        }
        res.send(word)
    } catch (e) {
        res.sendStatus(400)
    }
})

// Deletes
router.delete('/:id', async (req, res) => {
    try {
        const word = await Word.findByIdAndDelete(req.params.id)
        if (!word) {
            return res.sendStatus(404)
        }
        res.send(word)
    } catch (e) {
        res.sendStatus(500)
    }
})

// POST from csv
router.post('/csv', async (req, res) => {
    try {
        const word = new Word(req.body)
        console.log(word.word)
        await word.save()
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

module.exports = router
