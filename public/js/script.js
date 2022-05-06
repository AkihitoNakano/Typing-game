const word = document.getElementById('word')
const answer = document.getElementById('answer')
const scoreEl = document.getElementById('score')
const timeEl = document.getElementById('time')
const endgameEl = document.getElementById('end-game-container')
const settingsBtn = document.getElementById('settings-btn')
const settings = document.getElementById('settings')
const settingsForm = document.getElementById('settings-form')
const difficultySelect = document.getElementById('difficulty')

// Init words
let wordsGroup, wordCount

let selectedWord

// Input words
let correctLetters = []

// Init score
let score = 0

// Init time
let time = 10

// Set difficulty to value in ls or medium
let difficulty =
    localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'medium'

// Set difficulty select value
difficultySelect.value =
    localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'medium'

// Focus on text on start
// text.focus()

// 単語のグループを取得する
async function getWords() {
    try {
        const res = await fetch('/random')
        const words = await res.json()
        return words
    } catch (e) {
        throw new Error('Error:', e)
    }
}

//データベースから単語を取得してくる
async function initWords() {
    wordsGroup = await getWords()
    wordCount = wordsGroup.length - 1
}

// Add word to DOM
async function addWordToDOM() {
    if (wordCount < 0) {
        gameOver('Clear!!')
    } else {
        selectedWord = wordsGroup[wordCount].word
        word.innerHTML = selectedWord
        displayWord()
        wordCount--
    }
}

initWords()

function start() {
    console.log('start')
    addWordToDOM()
    settings.classList.add('hide')
    endgameEl.style.display = 'none'
    timeEl.innerHTML = time + 's'
    // Start counting down
    timeInterval = setInterval(updateTime, 1000)
}

// Show typing word
function displayWord() {
    let displayWords = correctLetters.map(letter => letter)
    while (displayWords.length < selectedWord.length) {
        displayWords.push(' ')
    }

    const convertWords = displayWords.join('').toString()
    answer.innerHTML = `${convertWords
        .split('')
        .map(letter => `<span class="letter">${letter ? letter : ''}</span>`)
        .join('')}`
}

// Update score
function updateScore() {
    score++
    scoreEl.innerHTML = score
}

// Update time
function updateTime() {
    time--
    timeEl.innerHTML = time + 's'
    console.log(time)
    if (time === 0) {
        // end game
        gameOver('Time Over')
    }
}

// Game over, show end screen
function gameOver(sentence) {
    clearInterval(timeInterval)
    endgameEl.innerHTML = `
        <h1>${sentence}</h1>
        <p>Your final score is ${score}</p>
        <button onclick="location.reload()">Reload</button>
    `

    endgameEl.style.display = 'flex'
    answer.style.display = 'none'
}

// Event listeners

//Typing
window.addEventListener('keydown', e => {
    if ((e.keyCode >= 48 && e.keyCode <= 90) || e.code === 'Period' || e.key === '_') {
        const letter = e.key
        if (correctLetters.length < selectedWord.length) {
            correctLetters.push(letter)

            displayWord()
        }
    } else if (e.key === 'Backspace') {
        correctLetters.pop()
        displayWord()
    }

    const insertedText = correctLetters.toString().replace(/,/g, '')
    if (insertedText === selectedWord) {
        setTimeout(() => {
            addWordToDOM()
            updateScore()
            // Clear
            correctLetters = []
            displayWord()

            if (difficulty === 'hard') {
                time += 2
            } else if (difficulty === 'medium') {
                time += 3
            } else {
                time += 5
            }

            updateTime()
        }, 100)
    }
})

// Settings btn click
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'))

// Settings select
settingsForm.addEventListener('change', e => {
    difficulty = e.target.value
    localStorage.setItem('difficulty', difficulty)
})
