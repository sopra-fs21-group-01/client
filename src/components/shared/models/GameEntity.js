class GameEntity {
    constructor(data = {}) {
        this.host = null;
        this.id = null;
        this.currentPlayer = null;
        this.currentValue = null;
        this.currentColor = null;
        this.opponentListHands = null;
        this.winner = null;
        // this.gamemode = null;
        // this.inGame = null;
        Object.assign(this, data);
    }
}
export default GameEntity;