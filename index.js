let player = {
    name: "Name",
    chips: 145
}
let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""

let dealerCards = [];
let dealerSum = 0;

let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let dealerCardsEl = document.getElementById("dealer-cards-el")
let dealerSumEl = document.getElementById("dealer-sum-el")

function startGame() {
    isAlive = true
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()
    cards = [firstCard, secondCard]
    sum = firstCard + secondCard

    dealerCards = [];
    dealerSum = 0
    dealCardToDealer()
    dealCardToDealer()
    renderGame()
}

function getRandomCard() {
    let randomNumer = Math.floor( Math.random()*13 ) + 1
    if (randomNumer > 10) {
        return 10
    } else if (randomNumer === 1) {
        return 11
    } else {
        return randomNumer
    }
}

function renderGame() {
    sumEl.textContent = "Sum: " + sum
    cardsEl.innerHTML = "Cards: "
    for (let i = 0; i < cards.length; i++) {
        const card = getCardUnicode(cards[i])
        cardsEl.innerHTML += `<div class="${card.cardClass}">${card.cardUnicode}</div> `
    }     
    if (sum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (sum === 21) {
        message = "Wohoo! You've got Blackjack! 🥳"
        hasBlackJack = true
    } else {
        message = "You're out of the game! 😭"
        isAlive = false
    }
    playerEl.textContent = player.name + ": $" + player.chips
    messageEl.textContent = message
    dealerCardsEl.innerHTML = "Dealer Cards: "
    for (let i = 0; i < dealerCards.length; i++) {
        const card = getCardUnicode(dealerCards[i])
        dealerCardsEl.innerHTML += `<div class="${card.cardClass}">${card.cardUnicode}</div> `
    }
    dealerSumEl.textContent = "Dealer Sum: " + dealerSum
}

function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard()
        sum += card
        cards.push(card)
        renderGame()
        dealerTurn()
        renderGame()
    }
}

function getCardUnicode(cardValue) {
    const suits = ["♠", "♣", "♥", "♦"]
    const randomSuit = suits[Math.floor(Math.random() * suits.length)]
    let cardUnicode = ""
    let cardClass = ""
    if (cardValue === 1) {
        cardUnicode = "A" + randomSuit
    } else if (cardValue === 11) {
        cardUnicode = "J" + randomSuit
    } else if (cardValue === 12) {
        cardUnicode = "Q" + randomSuit
    } else if (cardValue === 13) {
        cardUnicode = "K" + randomSuit
    } else {
        cardUnicode = cardValue + randomSuit
    }
    if (randomSuit === "♥" || randomSuit === "♦") {
        cardClass = "red-card"
    } else {
        cardClass = "black-card"
    }
    return { cardUnicode, cardClass }
}

function dealCardToDealer() {
    let card = getRandomCard()
    dealerSum += card
    dealerCards.push(card)
}

function dealerTurn() {
    while (dealerSum < 17) {
        dealCardToDealer()
    }
}