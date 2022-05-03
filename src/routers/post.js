const { Router } = require('express')
const Word = require('../models/word')

const router = Router()

// Get all words
router.get('/', async (req, res) => {
    try {
        const words = await Word.find({})
        const count = await Word.countDocuments({})
        console.log('Total count => ' + count)
        res.send(words)
    } catch (e) {
        res.sendStatus(500).send(e)
    }
})

// POST
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
    const allowedUpdates = ['word', 'score']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Contain some invalid words' })
    }

    try {
        const word = await Word.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

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

module.exports = router
