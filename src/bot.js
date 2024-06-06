const TelegramBot = require('node-telegram-bot-api')
const { TELEGRAM_TOKEN } = require('./config')
const gameManager = require('./games/gameManager')
const rockPaperScissors = require('./games/rockPaperScissors')

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true})

gameManager.addGame('rockPaperScissors', rockPaperScissors)

let waitingForPlayer = null

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome! Use /join to start a game of Rock-Paper-Scissors with another player.')
})

bot.onText(/\/join/, (msg) => {
  if (waitingForPlayer) {
    const player1Id = waitingForPlayer.id
    const player2Id = msg.from.id
    const gameId = rockPaperScissors.startGame(player1Id, player2Id)
    bot.sendMessage(waitingForPlayer.id, 'A player has joined! Use /rock, /paper, or /scissors to make your choice.')
    bot.sendMessage(msg.cht.id, 'You have joined the game! Use /rock, /paper, or /scissors to make your choice.')
    waitingForPlayer = null
    gameManager.addGame(gameId, {
      player1: player1Id,
      player2: msg.from.id
    })
  } else {
    waitingForPlayer = msg.from
    bot.sendMessage(msg.chat.id, 'Waiting for another player to join...')
  }
})

const makeChoice = (msg, choice) => {
  const gameId = Object.keys(gameManager.games).find(id =>
    gameManager.games[id].player1 === msg.from.id ||
    gameManager.games[id].player2 === msg.from.id
  )

  if (!gameId) {
    bot.sendMessage(msg.chat.id, 'You are not currently in a game. Use /join to start a new game.')
    return null
  }

  const game = gameManager.games[gameId]
  const result = rockPaperScissors.makeChoice(gameId, msg.from.id, choice)

  if (result) {
    let response = ''
    if (result === 'draw') response = " It's a draw!"
    else if (result === 'player1') response = "Player 1 wins!"
    else response = "Player 2 wins"
  }
  bot.sendMessage(game.player1, response)
  bot.sendMessage(game.player2, response)

  delete gameManager.games[gameId]
}

bot.onText(/\/rock/, (msg) => makeChoice(msg, 'rock'))
bot.onText(/\/paper/, (msg) => makeChoice(msg, 'paper'))
bot.onText(/\/scissors/, (msg) => makeChoice(msg, 'scissors'))