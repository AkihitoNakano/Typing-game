const word = document.getElementById('word')
const answer = document.getElementById('answer')
const wpmEl = document.getElementById('wpm')
const timeEl = document.getElementById('time')
const wordsLeftEl = document.getElementById('words-left')
const leftColTitle = document.getElementById('left-col')
const centerColTitle = document.getElementById('center-col')
const rightColTitle = document.getElementById('right-col')
const wordEl = document.querySelector('.word-container')
const arrow = document.querySelector('.arrow-down')
const startGameEl = document.getElementById('start-game-container')
const settingsBtn = document.getElementById('settings-btn')
const settings = document.getElementById('settings')
const settingsForm = document.getElementById('settings-form')
const difficultySelect = document.getElementById('difficulty')
const languageSelect = document.getElementById('language')

// Init words
let wordsGroup = []
let wordCount
let selectedWord

// Input words
let correctLetters = []

// play timer
let time = 0
let timeStamp = 0

// Set language to value in ls or javascript
let language =
  localStorage.getItem('language') !== null
    ? localStorage.getItem('language')
    : 'javascript'

// Set language select value
languageSelect.value =
  localStorage.getItem('language') !== null
    ? localStorage.getItem('language')
    : 'javascript'

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
  const arr = await getWords()

  arr.map(word => {
    const wordObject = { [word]: word.length }
    wordsGroup.push(wordObject)
  })
  wordCount = wordsGroup.length
}

// Add word to DOM
function addWordToDOM() {
  if (wordCount <= 0) {
    gameOver()

    // Calculate WPM
    let sum = ''
    wordsGroup.forEach(obj => {
      sum += Object.keys(obj)[0]
    })
    calculateWPM(sum, time)
  } else {
    // Calculate WPM
    calculateWPM(selectedWord, time - timeStamp)
    timeStamp = time

    selectedWord = Object.keys(wordsGroup[wordCount - 1])[0]
    word.innerHTML = selectedWord
    displayWord()
    // update left words
    wordsLeftEl.innerText = wordCount
    wordCount--
  }
}

// Count down when click on Start
function updateCountDown() {
  countTimer--
  startGameEl.innerHTML = `<h1>${countTimer}</h1>`
  if (countTimer < 0) {
    clearInterval(countDown)

    addWordToDOM()
    startGameEl.style.display = 'none'
    timeEl.innerHTML = time + 's'
    arrow.classList.add('show')

    // Start counting timer
    timeInterval = setInterval(updateTime, 100)
  }
}

function start() {
  initWords()
  countTimer = 3
  startGameEl.innerHTML = `<h1>${countTimer}</h1>`
  countDown = setInterval(updateCountDown, 1000)
  settings.classList.add('hide')
}

// WPMの計算式 文章の単語総数 / タイプした時間(秒) * 60
function calculateWPM(word, time) {
  if (word === undefined) {
    return (wpmEl.innerText = 0)
  }
  const wpm = Math.floor((word.length / time) * 60)
  wpmEl.innerText = wpm
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
    .map((letter, idx) => {
      if (letter === selectedWord[idx]) {
        return `<span class="letter">${letter ? letter : ''}</span>`
      } else {
        return `<span class="letter wrong">${letter ? letter : ''}</span>`
      }
    })
    .join('')}`
}

// Update time
function updateTime() {
  time += 0.1
  const fixedTime = time.toFixed(1)
  timeEl.innerHTML = fixedTime + 's'
}

// Game clear, show end screen
function gameOver() {
  clearInterval(timeInterval)

  leftColTitle.innerText = 'Clear time'
  centerColTitle.innerText = 'Rank'
  rightColTitle.innerText = 'WPM.average'

  // set ranking
  const rank = setRank()
  wordsLeftEl.innerText = rank

  // Show clear text and reload button
  wordEl.innerHTML = `
    <small>congratulations</small>
    <h1 id="word">---> Clear!! <---</h1>
    <button onclick="location.reload()">Reload</button>
    `
  answer.style.display = 'none'
  arrow.classList.remove('show')
}

function setRank() {
  if (time < 25) {
    return 'S'
  } else if (time < 35) {
    return 'A'
  } else if (time < 45) {
    return 'B'
  } else if (time < 55) {
    return 'C'
  } else {
    return 'D'
  }
}

// Event listeners
//Typing
window.addEventListener('keydown', e => {
  if (
    (e.keyCode >= 48 && e.keyCode <= 90) ||
    e.code === 'Period' ||
    e.key === '_' ||
    e.key === '-' ||
    e.key === '<' ||
    e.key === '>' ||
    e.key === ':' ||
    e.key === '+' ||
    e.key === '='
  ) {
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
