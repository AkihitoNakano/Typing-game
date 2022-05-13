const word = document.getElementById('word')
const answer = document.getElementById('answer')
const scoreEl = document.getElementById('score')
const timeEl = document.getElementById('time')
const leftEl = document.getElementById('left')
const arrow = document.querySelector('.arrow-down')
const endgameEl = document.getElementById('end-game-container')
const settingsBtn = document.getElementById('settings-btn')
const settings = document.getElementById('settings')
const settingsForm = document.getElementById('settings-form')
const difficultySelect = document.getElementById('difficulty')
const languageSelect = document.getElementById('language')

// Init words
let wordsGroup, wordCount

let selectedWord

// Input words
let correctLetters = []

// Init score
let score = 0

// play timer
let time = 0

// Set language to value in ls or javascript
let language =
    localStorage.getItem('language') !== null ? localStorage.getItem('language') : 'javascript'

// Set language select value
languageSelect.value =
    localStorage.getItem('language') !== null ? localStorage.getItem('language') : 'javascript'

// 単語のグループを取得する
async function getWords() {
    const language = languageSelect.value
    try {
        const res = await fetch(`/random?language=${language}`)
        const words = await res.json()
        return words
    } catch (e) {
        throw new Error('Error:', e)
    }
}

//データベースから単語を取得してくる
async function initWords() {
    wordsGroup = await getWords()
    wordCount = wordsGroup.length
}

// Add word to DOM
async function addWordToDOM() {
    if (wordCount <= 0) {
        gameOver('Clear!!')
    } else {
        selectedWord = wordsGroup[wordCount - 1].word
        word.innerHTML = selectedWord
        displayWord()
        // update left words
        leftEl.innerText = wordCount
        wordCount--
    }
}

// Count down when click on Start
function updateCountDown() {
    countTimer--
    endgameEl.innerHTML = `<h1>${countTimer}</h1>`
    if (countTimer < 0) {
        clearInterval(countDown)

        addWordToDOM()
        endgameEl.style.display = 'none'
        timeEl.innerHTML = time + 's'
        arrow.classList.add('show')

        // Start counting timer
        timeInterval = setInterval(updateTime, 1000)
    }
}

function start() {
    initWords()
    countTimer = 1
    endgameEl.innerHTML = `<h1>${countTimer}</h1>`
    countDown = setInterval(updateCountDown, 1000)
    settings.classList.add('hide')
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
    time++
    timeEl.innerHTML = time + 's'
}

// Game over, show end screen
function gameOver(sentence) {
    clearInterval(timeInterval)
    endgameEl.innerHTML = `
        <h1>${sentence}</h1>
        <p>Your final score is ${score}</p>
        <p>Clear time is ${time}s</p>
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
            updateScore()
            addWordToDOM()
            // Clear
            correctLetters = []
            displayWord()

            updateTime()
        }, 100)
    }
})

// Settings btn click
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'))

// language select to local storage
languageSelect.addEventListener('change', e => {
    language = e.target.value
    localStorage.setItem('language', language)
})
