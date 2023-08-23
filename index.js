const cardObjectDefinitions = [
  {
    id: 1,
    imagePath: '/images/card-KingHearts.png',
  },
  {
    id: 2,
    imagePath: '/images/card-JackClubs.png',
  },
  {
    id: 3,
    imagePath: '/images/card-QueenDiamonds.png',
  },
  {
    id: 4,
    imagePath: '/images/card-AceSpades.png',
  },
]

const aceId = 4

const cardBackImgPath = '/images/card-back-Blue.png'

let cards = []

const playGameButtonElem = document.getElementById('playGame')

const cardContainerElem = document.querySelector('.card-container')

const collapsedGridAreaTemplate = '"a a" "a a"'
const cardCollectionCellClass = '.card-pos-a'

const numCards = cardObjectDefinitions.length

let cardPositions = []

let gameInProgress = false
let shufflingInProgress = false
let cardsRevealed = false

const currentGameStatusElem = document.querySelector('.current-status')
const scoreContainerElem = document.querySelector('.header-score-container')
const scoreElem = document.querySelector('.score')
const roundContainerElem = document.querySelector('.header-round-container')
const roundElem = document.querySelector('.round')

const winColor = 'green'
const loseColor = 'red'
const primaryColor = 'black'

let roundNum = 0
let maxRounds = 4
let score = 0

let gameObj = {}

const localStorageGameKey = 'HTA'

/* <div class="card">
          <div class="card-inner">
            <div class="card-front">
              <img src="/images/card-JackClubs.png" alt="" class="card-img" />
            </div>
            <div class="card-back">
              <img src="/images/card-back-Blue.png" alt="" class="card-img" />
            </div>
          </div>
    </div> */

const gameOver = () => {
  updateStatusElement(scoreContainerElem, 'none')
  updateStatusElement(roundContainerElem, 'none')

  const gameOverMessage = `Game Over! Final Score - <span class='badge'>${score}</span> Click 'Play Game' to play again.`
  updateStatusElement(
    currentGameStatusElem,
    'block',
    primaryColor,
    gameOverMessage
  )

  gameInProgress = false
  playGameButtonElem.disabled = false
}

const endRound = () => {
  setTimeout(() => {
    if (roundNum == maxRounds) {
      gameOver()
      return
    } else {
      startRound()
    }
  }, 3000)
}

const chooseCard = (card) => {
  if (canChooseCard()) {
    evaluateCardChoice(card)
    saveGameObjectToLocalStorage(score, roundNum)
    flipCard(card, false)

    setTimeout(() => {
      flipCards(false)
      updateStatusElement(
        currentGameStatusElem,
        'block',
        primaryColor,
        'Card positions revealed'
      )

      endRound()
    }, 3000)
    cardsRevealed = true
  }
}

const calculateScoreToAdd = (roundNum) => {
  if (roundNum == 1) {
    return 100
  } else if (roundNum == 2) {
    return 50
  } else if (roundNum == 3) {
    return 25
  } else {
    return 10
  }
}

const calculateScore = () => {
  const scoreToAdd = calculateScoreToAdd(roundNum)
  score = score + scoreToAdd
}

const updateScore = () => {
  calculateScore()
  updateStatusElement(
    scoreElem,
    'block',
    primaryColor,
    `<span class='badge'>${score}</span>`
  )
}

const updateStatusElement = (elem, display, color, innerHTML) => {
  elem.style.display = display

  if (color !== undefined && innerHTML !== undefined) {
    elem.style.color = color
    elem.innerHTML = innerHTML
  }
}

const outputChoiceFeedBack = (hit) => {
  if (hit) {
    updateStatusElement(
      currentGameStatusElem,
      'block',
      winColor,
      'Hit!! - Well Done!! :)'
    )
  } else {
    updateStatusElement(
      currentGameStatusElem,
      'block',
      loseColor,
      "Miss!! - Sorry, you're wrong :("
    )
  }
}

const evaluateCardChoice = (card) => {
  if (card.id == aceId) {
    updateScore()
    outputChoiceFeedBack(true)
  } else {
    outputChoiceFeedBack(false)
  }
}

const canChooseCard = () => {
  return gameInProgress == true && !shufflingInProgress && !cardsRevealed
}

const loadGame = () => {
  createCards()

  cards = document.querySelectorAll('.card')

  cardFlyInEffect()

  playGameButtonElem.addEventListener('click', () => startGame())

  updateStatusElement(scoreContainerElem, 'none')
  updateStatusElement(roundContainerElem, 'none')
}

const checkForInCompleteGame = () => {
  const serializedGameObj = getLocalStorageItemVal(localStorageGameKey)

  if (serializedGameObj) {
    gameObj = getObjectFromJSON(serializedGameObj)

    if (gameObj.round >= maxRounds) {
      removeLocalStorageItem(localStorageGameKey)
    } else {
      if (confirm('Would you like to continue with your last game?')) {
        score = gameObj.score
        roundNum = gameObj.round
      }
    }
  }
}

const startGame = () => {
  initializeNewGame()
  startRound()
}

const initializeNewGame = () => {
  score = 0
  roundNum = 0

  checkForInCompleteGame()

  shufflingInProgress = false

  updateStatusElement(scoreContainerElem, 'flex')
  updateStatusElement(roundContainerElem, 'flex')

  updateStatusElement(
    scoreElem,
    'block',
    primaryColor,
    `Score <span class='badge'>${score}</span>`
  )
  updateStatusElement(
    roundElem,
    'block',
    primaryColor,
    `Round <span class='badge'>${roundNum}</span>`
  )
}

const startRound = () => {
  initializeNewRound()
  collectCards()
  flipCards(true)
  shuffleCards()
}

const initializeNewRound = () => {
  roundNum++
  playGameButtonElem.disabled = true

  gameInProgress = true
  shufflingInProgress = true
  cardsRevealed = false

  updateStatusElement(
    currentGameStatusElem,
    'block',
    primaryColor,
    'Shuffling...'
  )

  updateStatusElement(
    roundElem,
    'block',
    primaryColor,
    `Round <span class='badge'>${roundNum}</span>`
  )
}

const collectCards = () => {
  transformGridArea(collapsedGridAreaTemplate)
  addCardsToGridAreaCell(cardCollectionCellClass)
}

const transformGridArea = (areas) => {
  cardContainerElem.style.gridTemplateAreas = areas
}

const addCardsToGridAreaCell = (cellPositionClassName) => {
  const cellPositionElem = document.querySelector(cellPositionClassName)

  cards.forEach((card, index) => {
    addChildElement(cellPositionElem, card)
  })
}

const flipCard = (card, flipToBack) => {
  const innerCardElem = card.firstChild

  if (flipToBack && !innerCardElem.classList.contains('flip-it')) {
    innerCardElem.classList.add('flip-it')
  } else if (innerCardElem.classList.contains('flip-it')) {
    innerCardElem.classList.remove('flip-it')
  }
}

const flipCards = (flipToBack) => {
  cards.forEach((card, index) => {
    setTimeout(() => {
      flipCard(card, flipToBack)
    }, index * 100)
  })
}

const cardFlyInEffect = () => {
  let cardCount = 0
  let count = 0

  const flyIn = () => {
    count++
    if (cardCount == numCards) {
      clearInterval(id)
      playGameButtonElem.style.display = 'inline-block'
    }

    if (count == 1 || count == 250 || count == 500 || count == 750) {
      cardCount++
      let card = document.getElementById(cardCount)
      card.classList.remove('fly-in')
    }
  }

  const id = setInterval(flyIn, 5)
}

const removeShuffleClasses = () => {
  cards.forEach((card) => {
    card.classList.remove('shuffle-left')
    card.classList.remove('shuffle-right')
  })
}

const animateShuffle = (shuffleCount) => {
  const random1 = Math.floor(Math.random() * numCards) + 1
  const random2 = Math.floor(Math.random() * numCards) + 1

  let card1 = document.getElementById(random1)
  let card2 = document.getElementById(random2)

  if (shuffleCount % 4 == 0) {
    card1.classList.toggle('shuffle-left')
    card1.style.zIndex = 100
  }

  if (shuffleCount % 10 == 0) {
    card1.classList.toggle('shuffle-right')
    card1.style.zIndex = 200
  }
}

function shuffleCards() {
  const id = setInterval(shuffle, 12)
  let shuffleCount = 0

  function shuffle() {
    randomizeCardPositions()
    animateShuffle(shuffleCount)

    if (shuffleCount == 500) {
      clearInterval(id)
      shufflingInProgress = false
      removeShuffleClasses()
      dealCards()
      updateStatusElement(
        currentGameStatusElem,
        'block',
        primaryColor,
        'Please click the card that you think is the Ace of Spades...'
      )
    } else {
      shuffleCount++
    }
  }
}

const randomizeCardPositions = () => {
  const random1 = Math.floor(Math.random() * numCards) + 1
  const random2 = Math.floor(Math.random() * numCards) + 1

  const temp = cardPositions[random1 - 1]

  cardPositions[random1 - 1] = cardPositions[random2 - 1]
  cardPositions[random2 - 1] = temp
}

const dealCards = () => {
  addCardsToAppropriateCell()
  const aresTemplate = returnGridAreasMappedToCardPos()

  transformGridArea(aresTemplate)
}

const returnGridAreasMappedToCardPos = () => {
  let firstPart = ''
  let secondPart = ''
  let areas = ''

  cards.forEach((card, index) => {
    if (cardPositions[index] == 1) {
      areas = areas + 'a '
    } else if (cardPositions[index] == 2) {
      areas = areas + 'b '
    } else if (cardPositions[index] == 3) {
      areas = areas + 'c '
    } else if (cardPositions[index] == 4) {
      areas = areas + 'd '
    }

    if (index == 1) {
      firstPart = areas.substring(0, areas.length - 1)
      areas = ''
    } else if (index == 3) {
      secondPart = areas.substring(0, areas.length - 1)
    }
  })
  return `"${firstPart}" "${secondPart}"`
}

const addCardsToAppropriateCell = () => {
  cards.forEach((card) => {
    addCardToGridCell(card)
  })
}

const createCards = () => {
  cardObjectDefinitions.forEach((cardItem) => {
    createCard(cardItem)
  })
}

/* FINAL FUNCTION */

const createCard = (cardItem) => {
  // crate div element that make up a card
  const cardElem = document.createElement('div')
  const cardInnerElem = createElement('div')
  const cardFrontElem = createElement('div')
  const cardBackElem = createElement('div')

  // create front and back image elements for a card
  const cardFrontImg = createElement('img')
  const cardBackImg = createElement('img')

  // add class and id to card element
  addClassToElement(cardElem, 'card')
  addClassToElement(cardElem, 'fly-in')
  addIdToElement(cardElem, cardItem.id)

  // add class to inner card element
  addClassToElement(cardInnerElem, 'card-inner')

  // add class to front card element
  addClassToElement(cardFrontElem, 'card-front')

  // add class to back card element
  addClassToElement(cardBackElem, 'card-back')

  // add src attribute and appropriate value to img element - back of card
  addSrcToImageElem(cardBackImg, cardBackImgPath)

  // add src attribute and appropriate value to img element - front of card
  addSrcToImageElem(cardFrontImg, cardItem.imagePath)

  // assign class to back image element of back of card
  addClassToElement(cardBackImg, 'card-img')

  // assign class to front image element of front of card
  addClassToElement(cardFrontImg, 'card-img')

  // add front image element as child element to front card element
  addChildElement(cardFrontElem, cardFrontImg)

  // add back image element as child element to back card element
  addChildElement(cardBackElem, cardBackImg)

  // add front card element as child element to inner card element
  addChildElement(cardInnerElem, cardFrontElem)

  // add back card element as child element to inner card element
  addChildElement(cardInnerElem, cardBackElem)

  // add inner card element as child element to card element
  addChildElement(cardElem, cardInnerElem)

  // add card element as child element to appropriate grid cell
  addCardToGridCell(cardElem)

  initializeCardPositions(cardElem)

  attatchClickEventHandlerToCard(cardElem)
}

const attatchClickEventHandlerToCard = (card) => {
  card.addEventListener('click', () => chooseCard(card))
}

const initializeCardPositions = (card) => {
  cardPositions.push(card.id)
}

const createElement = (elemType) => {
  return document.createElement(elemType)
}
const addClassToElement = (elem, className) => {
  elem.classList.add(className)
}
const addIdToElement = (elem, id) => {
  elem.id = id
}
const addSrcToImageElem = (imgElem, src) => {
  imgElem.src = src
}
const addChildElement = (parentElem, childElem) => {
  parentElem.appendChild(childElem)
}

const addCardToGridCell = (card) => {
  const cardPositionClassName = mapCardIdToGridCell(card.id)
  const cardPosElem = document.querySelector(cardPositionClassName)

  addChildElement(cardPosElem, card)
}

const mapCardIdToGridCell = (cardId) => {
  if (cardId == 1) {
    return '.card-pos-a'
  } else if (cardId == 2) {
    return '.card-pos-b'
  } else if (cardId == 3) {
    return '.card-pos-c'
  } else if (cardId == 4) {
    return '.card-pos-d'
  }
}

// local storage functions

const getSerializedObjectAsJSON = (obj) => {
  return JSON.stringify(obj)
}

const getObjectFromJSON = (json) => {
  return JSON.parse(json)
}

const updateLocalStorageItem = (key, value) => {
  localStorage.setItem(key, value)
}

const removeLocalStorageItem = (key) => {
  localStorage.removeItem(key)
}

const getLocalStorageItemVal = (key) => {
  return localStorage.getItem(key)
}

const updateGameObject = (score, round) => {
  gameObj.score = score
  gameObj.round = round
}

const saveGameObjectToLocalStorage = (score, round) => {
  updateGameObject(score, round)
  updateLocalStorageItem(
    localStorageGameKey,
    getSerializedObjectAsJSON(gameObj)
  )
}

loadGame()
