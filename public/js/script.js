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
let time = 1000

// Set difficulty to value in ls or medium
let difficulty =
    localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'medium'

// Set difficulty select value
difficultySelect.value =
    localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'medium'

// Focus on text on start
// text.focus()

// Start counting down
const timeInterval = setInterval(updateTime, 1000)

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

async function initWords() {
    wordsGroup = await getWords()
    wordCount = wordsGroup.length - 1
    addWordToDOM()
}

// Add word to DOM
async function addWordToDOM() {
    if (wordCount < 0) {
        gameOver()
    } else {
        selectedWord = wordsGroup[wordCount].word
        word.innerHTML = selectedWord
        displayWord()
        wordCount--
    }
}

initWords()

// Show typing word
function displayWord() {
    let displayWords = correctLetters.map(letter => letter)
    while (displayWords.length <= selectedWord.length) {
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

    if (time === 0) {
        clearInterval(timeInterval)
        // end game
        gameOver()
    }
}

// Game over, show end screen
function gameOver() {
    endgameEl.innerHTML = `
        <h1>Time ran out</h1>
        <p>Your final score is ${score}</p>
        <button onclick="location.reload()">Reload</button>
    `

    endgameEl.style.display = 'flex'
}

// Event listeners

//Typing
window.addEventListener('keydown', e => {
    // console.log(correctLetters.length, selectedWord.length)
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key
        if (correctLetters.length <= selectedWord.length) {
            correctLetters.push(letter)

            displayWord()
        }
    }
    const insertedText = correctLetters.toString().replace(/,/g, '')
    if (insertedText === selectedWord) {
        addWordToDOM()
        updateScore()
        // Clear
        e.target.value = ''

        if (difficulty === 'hard') {
            time += 2
        } else if (difficulty === 'medium') {
            time += 3
        } else {
            time += 5
        }

        updateTime()
    }
})

// Settings btn click
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'))

// Settings select
settingsForm.addEventListener('change', e => {
    difficulty = e.target.value
    localStorage.setItem('difficulty', difficulty)
})

// document.addEventListener('keydown', e => console.log(e.key))
