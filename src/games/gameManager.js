class GameManager {
  constructor() {
    this.games = {}
  }

  addGame(gameName, gameInstance) {
    this.games[gameName] = gameInstance
  }

  getGame(gameName) {
    return this.games[gameName]
  }
}

module.exports = new GameManager()