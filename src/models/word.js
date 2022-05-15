const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
    },
    language: {
        type: String,
        required: true,
        trim: true,
        default: 'javascript',
    },
})

const Word = mongoose.model('Word', wordSchema)

module.exports = Word
