const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
    },
    score: {
        type: Number,
        default: 1,
        validate(value) {
            if (value < 0) {
                throw new Error('Score must be a positive number')
            }
        },
    },
})

const Word = mongoose.model('Word', wordSchema)

module.exports = Word
