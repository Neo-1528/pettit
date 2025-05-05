
export class GameLogic {
  constructor(setters, getters) {
    this.setDeck = setters.setDeck;
    this.setHand = setters.setHand;
    this.setField = setters.setField;
    this.setEnemyField = setters.setEnemyField;
    this.setPP = setters.setPP;
    this.setEnemyPP = setters.setEnemyPP;
    this.setTurn = setters.setTurn;
    this.setResult = setters.setResult;
    this.setPlayerGraveyard = setters.setPlayerGraveyard;
    this.setEnemyGraveyard = setters.setEnemyGraveyard;

    this.getDeck = getters.getDeck;
    this.getHand = getters.getHand;
    this.getField = getters.getField;
    this.getEnemyField = getters.getEnemyField;
    this.getPP = getters.getPP;
    this.getEnemyPP = getters.getEnemyPP;
    this.getTurn = getters.getTurn;

    this.onDraw = null;

    this.hasPlayedCardThisTurn = false; // Track if a card has been played this turn
    this.hasAttackedThisTurn = false; // Track if an attack has been made this turn
  }

  useItemCardOnTarget(card, targetIndex) {
    const effect = card.effect;
    const value = card.value;
    const field = [...this.getField()];

    switch (effect) {
      case "heal":
        if (field[targetIndex]) {
          field[targetIndex].hp += value;
          this.setField(field);
        }
        break;
      
      case "draw":
        const deck = [...this.getDeck()];
        const hand = [...this.getHand()];
        const drawCards = deck.slice(0, value);
        this.setDeck(deck.slice(value));
        this.setHand([...hand, ...drawCards]);
        break;

      case "boost":
        if (field[targetIndex]) {
          field[targetIndex].ap += value;
          this.setField(field);
        }
        break;

      default:
        console.warn("未対応のアイテム効果:", effect);
    }
  }

  setOnDraw(callback) {
    this.onDraw = callback;
  }

  attack(attackerIndex, targetIndex) {
    if (this.hasAttackedThisTurn) return; // Prevent multiple attacks in one turn
    const field = [...this.getField()];
    const enemyField = [...this.getEnemyField()];
    const attacker = field[attackerIndex];
    const target = enemyField[targetIndex];

    if (!attacker || !target) return; // Check if both attacker and target exist

    target.hp -= attacker.ap; // Reduce target's HP by attacker's AP
    if (target.hp <= 0) {
      enemyField.splice(targetIndex, 1);
      this.setEnemyField(enemyField);
      const enemyPP = this.getEnemyPP();
      const updatedEnemyPP = enemyPP - target.pp;

      this.setEnemyGraveyard(prev => [...prev, target]);
      
      if (updatedEnemyPP <= 0) {
        this.setEnemyPP(0);
        this.setResult("win");
      } else {
        this.setEnemyPP(updatedEnemyPP);
      }
    } else {
      this.setEnemyField(enemyField);
    }

    this.hasAttackedThisTurn = true; // Mark that an attack has been made this turn
  }

  enemyAttack() {
    if (this.hasAttackedThisTurn) return;

    const enemyField = [...this.getEnemyField()];
    const field = [...this.getField()];
    if (enemyField.length === 0 || field.length === 0) return;
    const attackerIndex = Math.floor(Math.random() * enemyField.length);
    const targetIndex = Math.floor(Math.random() * field.length);

    const attacker = enemyField[attackerIndex];

    if (!attacker || !field[targetIndex]) return; // Check if either field is empty
      field[targetIndex].hp -= attacker.ap;

      if (field[targetIndex].hp <= 0) {
        const target = field[targetIndex];
        target._alreadyDefeated = true;
        field.splice(targetIndex, 1);
        this.setField(field);
        const updatedPP = this.getPP() - target.pp;

        this.setPlayerGraveyard(prev => [...prev, target]);
          
          if (updatedPP <= 0) {
            this.setPP(0);
            this.setResult("lose");
          } else {
            this.setPP(updatedPP);
          }
            } else {
              this.setField(field);
            }
            this.hasAttackedThisTurn = true;
  }

  initializePlayer(cardList) {
    const draw = cardList.slice(0, 5); // Draw 5 cards
    const rest = cardList.slice(5);
    this.setDeck(rest);
    this.setHand(draw);
    this.setField([]); // Initialize field as empty
    this.setPP(50);
    this.setTurn(1);
  }

  initializeEnemy() {
    const enemyDeck = [...this.getDeck()]; // Get the current deck
    const enemyDraw = enemyDeck.slice(0, 5); // Draw 5 cards for the enemy
    const enemyRest = enemyDeck.slice(5); // Remaining cards in the deck  
    this.setEnemyDeck(enemyRest); // Set the remaining cards as the enemy deck
    this.setEnemyHand(enemyDraw); // Set the drawn cards as the enemy hand
    this.setEnemyField([]); // Initialize enemy field as empty
    this.setEnemyPP(50); // Set enemy PP to 50
    this.setEnemyTurn(1); // Set enemy turn to 1
  }

  playCard(index) {
    
    const hand = [...this.getHand()];
    const card = hand[index]; // Get the card to be played
    if (!card) return;

    if (card.type === "item") {
      this.useItemCard(card);
      hand.splice(index, 1);
      this.setHand(hand);
      this.hasPlayedCardThisTurn = true;
      return;
    }
    const field = [...this.getField()];
    if (!card || field.length >= 3 || this.hasPlayedCardThisTurn) return;

    field.push({ ...card, canAttackNextTurn: false});
    hand.splice(index, 1);
    this.setField(field);
    this.setHand(hand);
    this.hasPlayedCardThisTurn = true; // Mark that a card has been played this turn
  }

  endTurn() {
    const currentField = this.getField();
    const aliveField = currentField.filter(card => card.hp > 0);
    const defeatedCards = currentField.filter(card => card.hp <= 0 && !card._alreadyDefeated);
    if (defeatedCards.length > 0) {
      this.setPlayerGraveyard(prev => [...prev, ...defeatedCards]);
      let totalPP = this.getPP();
      defeatedCards.forEach(card => {
        totalPP -= card.pp;
      });
      this.setPP(Math.max(totalPP, 0));
    }

    const updatedField = aliveField.map(card => ({
    ...card,
    canAttackNextTurn: true
  }));
  this.setField(updatedField);


    const currentTurn = this.getTurn() + 1;
    this.setTurn(currentTurn);

    this.hasPlayedCardThisTurn = false; // Reset for the next turn
    this.hasAttackedThisTurn = false; // Reset for the next turn

    if (currentTurn % 2 === 1) {
    const deck = [...this.getDeck()];
    const hand = [...this.getHand()];

      if (deck.length > 0) {
        let ppLimit = 99;
        if (currentTurn <= 6) ppLimit = 3;
        else if (currentTurn <= 20) ppLimit = 7;
        const candidates = deck.filter(card => card.pp <= ppLimit);
        if (candidates.length > 0) {
          const randomCard = candidates[Math.floor(Math.random() * candidates.length)];
          const newDeck = deck.filter(c => c !== randomCard);
          hand.push(randomCard);
          this.setDeck(newDeck);
          this.setHand(hand);
          if (this.onDraw) this.onDraw();
        }
      }
    }
  }

  enemyPlay() {
    const enemyField = [...this.getEnemyField()];
    if (enemyField.length >= 3) return;
    const newCard = { name: "敵カード", hp: 5, ap: 30, pp: 1 };
    this.setEnemyField([...enemyField, newCard]);
  }
}
