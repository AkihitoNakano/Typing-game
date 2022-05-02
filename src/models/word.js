const mongoose = require('mongoose')

const Word = mongoose.model('Word', {
    word: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 1,
    },
    score: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Score must be a positive number')
            }
        },
    },
})

module.exports = Word
