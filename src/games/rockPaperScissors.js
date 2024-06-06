const { getRandomElement } = require('../helper');

class RockPaperScissors {
  constructor() {
    this.choices = ['rock', 'paper', 'scissors'];
    this.games = {}
  }

  startGame(player1Id, player2Id) {
    const gameId = `${player1Id}-${player2Id}`
    this.games[gameId] = {
      player1Id,
      player2Id,
      player1Choice: null,
      player2Choice: null
    }
    return gameId
  }

  makeChoice(gameId, playerId, choice) {
    const game = this.games[gameId]
    if (!game) throw new Error('Game not found')
    if (!this.choices.includes(choice)) throw new Error('Invalid choice')

    if (game.player1Id === playerId) {
      game.player1Choice = choice
    } else if (game.player2Id === playerId){
      game.player2Choice = choice
    } else {
      throw new Error('Player not part of this game')
    }

    if (game.player1Choice && game.player2Choice) {
      return this.determineWinner(game)
    }
    return null
  }

  determineWinner(player1Choice, player2Choice) {
    if (player1Choice === player2Choice) {
      return 'draw'
    }
    if (
      (player1Choice === 'rock' && player2Choice === 'scissors') ||
      (player1Choice === 'paper' && player2Choice === 'rock') ||
      (player1Choice === 'scissors' && player2Choice === 'paper')
    ) {
      return 'player1';
    }
    return 'player2';
  }
}

module.exports = new RockPaperScissors()