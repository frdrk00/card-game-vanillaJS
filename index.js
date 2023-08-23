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

const cardBackImgPath = '/images/card-back-Blue.png'

let cards = []

const playGameButtonElem = document.getElementById('playGame')

const cardContainerElem = document.querySelector('.card-container')

const collapsedGridAreaTemplate = '"a a" "a a"'
const cardCollectionCellClass = '.card-pos-a'

const numCards = cardObjectDefinitions.length

let cardPositions = []

{
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
}

const loadGame = () => {
  createCards()

  cards = document.querySelectorAll('.card')

  playGameButtonElem.addEventListener('click', () => startGame())
}

const startGame = () => {
  initializeNewGame()
  startRound()
}

const initializeNewGame = () => {}

const startRound = () => {
  initializeNewRound()
  collectCards()
  flipCards(true)
}

const initializeNewRound = () => {}

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

const shuffleCards = () => {
  const id = setInterval(shuffle, 12)
  let shuffleCount = 0

  const shuffle = () => {
    randomizeCardPosition()

    if (shuffleCount == 500) {
      clearInterval(id)
    } else {
      shuffleInterval++
    }
  }
}

const randomizeCardPosition = () => {
  const random1 = Math.floor(Math.random() * numCards) + 1
  const random2 = Math.floor(Math.random() * numCards) + 1

  const temp = cardPositions[random1 - 1]

  cardPositions[random1 - 1] = cardPositions[random2 - 1]
  cardPositions[random2 - 1] = temp
}

const createCards = () => {
  cardObjectDefinitions.forEach((cardItem) => {
    createCard(cardItem)
  })
}

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

loadGame()
