class GameEntity {
    constructor(data = {}) {
        this.host = null;
        this.id = null;
        this.cardStack = null;
        this.playerList = null;
        this.gamemode = null;
        Object.assign(this, data);
    }
}
export default GameEntity;