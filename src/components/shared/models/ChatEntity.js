class ChatEntity {
    constructor(data = {}) {
        this.lobby = null;
        this.message = null;
        this.timestamp = null;
        Object.assign(this, data);
    }
}
export default ChatEntity;