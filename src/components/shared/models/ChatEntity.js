class ChatEntity {
    constructor(data = {}) {
        this.id = null;
        this.message = null;
        Object.assign(this, data);
    }
}
export default ChatEntity;