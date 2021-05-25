/**
 * Opponent model
 */
 class Hand {
    constructor(data = {}) {
      this.id = null;
      this.cards = null;
      Object.assign(this, data);
    }
  }
  export default Hand;
  