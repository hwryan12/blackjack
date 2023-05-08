let player = {
    name: "Name",
    chips: 145
}
let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""
let betAmount = 0;

let dealerChips = 1000;
let dealerCards = [];
let dealerSum = 0;

let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let dealerCardsEl = document.getElementById("dealer-cards-el")
let dealerSumEl = document.getElementById("dealer-sum-el")
let playerForm = document.getElementById("player-form")
let newPlayerBtn = document.getElementById("new-player")
let playerContainer = document.getElementById("player-container")
let dealerContainer = document.getElementById("dealer-container")
let newCardBtn = document.getElementById("new-card")
let startBtn = document.getElementById("start-game")


playerForm.addEventListener("submit", function(event) {
    event.preventDefault()
    player.name = document.getElementById("player-name").value
    player.chips = parseInt(document.getElementById("player-chips").value)
    playerForm.style.display = "none"
    renderGame()
})

function startGame() {
    betAmount = 0
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
    if (isAlive) {
        handleBets();
    }
    sumEl.textContent = "Sum: " + sum;
    cardsEl.innerHTML = "Cards: ";
    for (let i = 0; i < cards.length; i++) {
        const card = getCardUnicode(cards[i]);
        cardsEl.innerHTML += `<div class="${card.cardClass}">${card.cardUnicode}</div> `;
    }
    playerEl.textContent = player.name + ": $" + player.chips;
    messageEl.textContent = message;
    dealerCardsEl.innerHTML = "Dealer Cards: ";
    for (let i = 0; i < dealerCards.length; i++) {
        const card = getCardUnicode(dealerCards[i]);
        dealerCardsEl.innerHTML += `<div class="${card.cardClass}">${card.cardUnicode}</div> `;
    }
    dealerSumEl.textContent = "Dealer Sum: " + dealerSum;

    if (player.name) {
        newPlayerBtn.style.display = "inline-block";
    } else {
        newPlayerBtn.style.display = "none";
    }
    if (player.name) {
        playerContainer.style.display = "block";
        dealerContainer.style.display = "block";
        newCardBtn.style.display = "inline-block";
        startBtn.style.display = "inline-block";
    } else {
        playerContainer.style.display = "none";
        dealerContainer.style.display = "none";
        newCardBtn.style.display = "none";
        startBtn.style.display = "none";
        messageEl.textContent = "Please enter your name and chips to start the game!";
    }
}


function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard()
        sum += card
        cards.push(card)
        renderGame()
        dealerTurn()
        renderGame()
        if (!isAlive) {
            dealerTurn();
            handleBets();
            renderGame();
        }
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

function newPlayer() {
    playerForm.style.display = "block"
    document.getElementById("player-name").value = ""
    document.getElementById("player-chips").value = ""
    player = {
        name: "",
        chips: 0
    }
    renderGame()
}

function placeBet() {
    let betInput = document.getElementById("bet-input");
    betAmount = parseInt(betInput.value);

    if (betAmount > player.chips) {
        message = "You don't have enough chips!";
        renderGame();
    } else if (betAmount <= 0) {
        message = "You must place a bet greater than 0!";
        renderGame();
    } else {
        message = `You have placed a bet of $${betAmount}.`;
        player.chips -= betAmount;
        renderGame();
        startGame();
    }
}

function handleBets() {
    if (sum > 21 || (dealerSum <= 21 && dealerSum > sum)) {
        // Player loses
        message = "You lost! 😭";
        dealerChips += betAmount;
    } else if (dealerSum > 21 || sum > dealerSum || (sum === 21 && dealerSum !== 21)) {
        // Player wins (dealer goes over 21 or player's cards are closer to 21)
        message = "You won! 🎉";
        player.chips += betAmount * 2;
    } else if (sum === dealerSum) {
        // Draw
        message = "It's a draw! 🤝";
        player.chips += betAmount;
    }
}