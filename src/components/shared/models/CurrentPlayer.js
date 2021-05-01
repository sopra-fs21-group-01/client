class CurrentPlayer {
    constructor(data = {}) {
        this.id = null;
        this.username = null;
        Object.assign(this, data);
    }
}
export default CurrentPlayer;