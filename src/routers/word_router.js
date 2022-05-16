const { Router } = require('express')
const Word = require('../models/word')
const { auth, authRole } = require('../middleware/auth')

const router = Router()

// GET words
// GET /words?lang=javascript
// GET /words?sortBy=createAt:asc
// limit skip
// create pagination function
router.get('/', auth, queryResults(), paginatedResults(), async (req, res) => {
    res.json(res.paginatedResults)
})

// Post a word
router.post('/', auth, authRole('ADMIN'), async (req, res) => {
    const word = new Word(req.body)
    try {
        await word.save()
        res.send(word)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Update
router.patch('/:id', auth, authRole('ADMIN'), async (req, res) => {
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
router.delete('/:id', auth, authRole('ADMIN'), async (req, res) => {
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
router.post('/csv', auth, async (req, res) => {
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

// ?lang=javascript
function queryResults() {
    return async (req, res, next) => {
        const allowedTag = ['javascript', 'python', 'html-css']
        let match = {}

        // langクエリ（タグ名）とマッチしているWordを取得する
        if (!allowedTag.includes(req.query.lang)) {
            match = await Word.find({})
        } else {
            match = await Word.find({ language: req.query.lang })
        }

        try {
            const count = match.length
            console.log('document counts => ' + count)
            req.body = match
            next()
        } catch (e) {
            res.sendStatus(500).send(e)
        }
    }
}

// pagination
function paginatedResults() {
    return async (req, res, next) => {
        const match = req.body

        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)

        // pageとlimitを何も入力しなければlangの全てのwordsが返ってくる
        if (isNaN(page) && isNaN(limit)) {
            const test = 'test'
            page = 1
            limit = match.length
        }
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < match.length) {
            results.next = {
                page: page + 1,
                limit: limit,
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            }
        }
        try {
            results.results = await match.slice(startIndex, endIndex)
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

module.exports = router
