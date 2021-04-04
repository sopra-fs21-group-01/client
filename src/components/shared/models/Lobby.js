class Lobby {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.password = null;
    this.host = null;
    this.playerList = null;
    Object.assign(this, data);
  }
}
export default Lobby;