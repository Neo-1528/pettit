import enemyAI from "./enemyAI/index.js";

export class GameLogic {
  constructor(setters, getters) {
    this.setHand = setters.setHand;
    this.setDeck = setters.setDeck;
    this.setField = setters.setField;
    this.setGraveyard = setters.setGraveyard;
    this.setPP = setters.setPP;
    this.setTurn = setters.setTurn;

    this.setEnemyHand = setters.setEnemyHand;
    this.setEnemyDeck = setters.setEnemyDeck;
    this.setEnemyField = setters.setEnemyField;
    this.setEnemyGraveyard = setters.setEnemyGraveyard;
    this.setEnemyPP = setters.setEnemyPP;

    this.getHand = getters.getHand;
    this.getDeck = getters.getDeck;
    this.getField = getters.getField;
    this.getGraveyard = getters.getGraveyard;
    this.getPP = getters.getPP;
    this.getTurn = getters.getTurn;

    this.getEnemyHand = getters.getEnemyHand;
    this.getEnemyDeck = getters.getEnemyDeck;
    this.getEnemyField = getters.getEnemyField;
    this.getEnemyGraveyard = getters.getEnemyGraveyard;
    this.getEnemyPP = getters.getEnemyPP;
    this.getPlayerPP = getters.getPlayerPP;
  }

  initializePlayer(deck) {
    const draw = deck.slice(0, 5);
    const rest = deck.slice(5);
    this.setDeck(rest);
    this.setHand(draw);
    this.setField([]);
    this.setGraveyard([]);
    this.setPP(50);
  }

  initializeEnemy(deck) {
    const draw = deck.slice(0, 5);
    const rest = deck.slice(5);
    this.setEnemyDeck(rest);
    this.setEnemyHand(draw);
    this.setEnemyField([]);
    this.setEnemyGraveyard([]);
    this.setEnemyPP(50);
  }

  drawCard() {
    const deck = [...this.getDeck()];
    const hand = [...this.getHand()];
    if (deck.length === 0) return;
    const card = deck.shift();
    this.setDeck(deck);
    this.setHand([...hand, card]);
  }

  enemyDrawCard() {
    const deck = [...this.getEnemyDeck()];
    const hand = [...this.getEnemyHand()];
    if (deck.length === 0) return;
    const card = deck.shift();
    this.setEnemyDeck(deck);
    this.setEnemyHand([...hand, card]);
  }

  drawInitialHand(deck) {
    const draw = deck.slice(0, 5);
    const rest = deck.slice(5);
    this.setDeck(rest);
    this.setHand(draw);
  }

  drawEnemyInitialHand(deck) {
    const draw = deck.slice(0, 5);
    const rest = deck.slice(5);
    this.setEnemyDeck(rest);
    this.setEnemyHand(draw);
  }

  playCard(index) {
    const hand = [...this.getHand()];
    const field = [...this.getField()];
    const pp = this.getPP();
    const card = hand[index];
    if (!card || field.length >= 3 || card.pp > pp) return false;
    field.push({ ...card, currentHp: card.hp, attacked: false, canAttack: false });
    hand.splice(index, 1);
    this.setHand(hand);
    this.setField(field);
    return true;
  }

  enemyPlayCard() {
    const hand = [...this.getEnemyHand()];
    const field = [...this.getEnemyField()];
    const pp = this.getEnemyPP();
    if (field.length >= 3) return;
    const playable = hand.filter(c => c.pp <= pp);
    if (playable.length === 0) return;
    const selected = playable[Math.floor(Math.random() * playable.length)];
    const newCard = { ...selected, currentHp: selected.hp, attacked: false, canAttack: false };
    this.setEnemyField([...field, newCard]);
    this.setEnemyHand(hand.filter(c => c !== selected));
  }

  attackPhase() {
    const field = [...this.getField()];
    const newField = field.map(c => ({ ...c, attacked: true }));
    this.setField(newField);
  }

  enemyAttackPhase() {
    const enemyField = [...this.getEnemyField()];
    const playerField = [...this.getField()];
    let newPlayerField = [...playerField];
    let newPlayerPP = this.getPlayerPP();
    const newGrave = [...this.getGraveyard()];

    enemyField.forEach(attacker => {
      if (!attacker.canAttack || newPlayerField.length === 0) return;
      newPlayerField[0].currentHp -= attacker.ap;
      if (newPlayerField[0].currentHp <= 0) {
        newPlayerPP -= newPlayerField[0].pp;
        newGrave.push(newPlayerField[0]);
        newPlayerField.shift();
      }
    });

    this.setField(newPlayerField);
    this.setGraveyard(newGrave);
    this.setPP(Math.max(0, newPlayerPP));
  }

  endTurn() {
    this.setTurn(this.getTurn() + 1);
    const field = this.getField().map(c => ({ ...c, attacked: false, canAttack: true }));
    this.setField(field);
    const enemyField = this.getEnemyField().map(c => ({ ...c, attacked: false, canAttack: true }));
    this.setEnemyField(enemyField);
  }

  moveToGraveyard(card) {
    const grave = [...this.getGraveyard()];
    grave.push(card);
    this.setGraveyard(grave);
    this.setPP(this.getPP() - card.pp);
  }

  checkGameEnd() {
    const pp = this.getPP();
    return pp <= 0 ? "lose" : null;
  }

  generateDeck(baseCards, size = 30) {
    const deck = [];
    for (let i = 0; i < size; i++) {
      deck.push({ ...baseCards[i % baseCards.length] });
    }
    return deck;
  }
}