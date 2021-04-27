class Lobby {
    constructor(data = {}) {
        this.host = null;
        this.id = null;
        this.playerList = null;
        this.gamemode = null;
        this.inGame = null;
        Object.assign(this, data);
    }
}
export default Lobby;