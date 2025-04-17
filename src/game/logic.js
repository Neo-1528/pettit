import enemyAI from "./enemyAI/index.js";

export class GameLogic {
    constructor(setters, getters, options = {}) {
      this.setDeck = setters.setDeck;
      this.setHand = setters.setHand;
      this.setEnemyDeck = setters.setEnemyDeck;
      this.setEnemyHand = setters.setEnemyHand;
      this.setField = setters.setField;
      this.setEnemyField = setters.setEnemyField;
      this.setTurn = setters.setTurn;     
      this.getTurn = getters.getTurn;
      this.setEnemyGraveyard = setters.setEnemyGraveyard;
      this.setGraveyard = setters.setGraveyard;
      this.setPlayerPP = setters.setPlayerPP;
      this.setLog = setters.setLog;
      this.setGameResult = setters.setGameResult;
      this.getEnemyGraveyard = getters.getEnemyGraveyard;
      this.getGraveyard = getters.getGraveyard;
      this.getPlayerPP = getters.getPlayerPP;
      this.getEnemyPP = getters.getEnemyPP;
      this.getField = getters.getField;
      this.getDeck = getters.getDeck;
      this.getHand = getters.getHand;
      this.getEnemyHand = getters.getEnemyHand;
      this.getEnemyField = getters.getEnemyField;
      this.aiLevel = options.aiLevel;
      }

      assignUidToCard(card) {
        return {
          ...card,
          uid: card.uid || `${card.name}-${Date.now()}-${Math.random()}`,
        };
      }
    
      drawInitialHand(deckSource, mulliganCount = 3) {
        let newDeck = [...deckSource];
        let drawn;
        do {
          drawn = newDeck.splice(0, 5).map(c => this.assignUidToCard(c));
        } while (!this.containsLowPPCards(drawn) && mulliganCount === 3);
        this.setDeck(newDeck);
        this.setHand(drawn);
      }
    
      drawCards(count) {
        const turn = this.getTurn();
        const restriction = this.getPPRestriction(turn);
    
        const deck = this.getDeck();
        const hand = this.getHand();
    
        const newDeck = [...deck];
        const newHand = [...hand];
    
        for (let i = 0; i < count; i++) {
          const validCards = newDeck.filter(card => card.pp <= restriction);
          if (validCards.length === 0) break;
          const selected = this.assignUidToCard(validCards[Math.floor(Math.random() * validCards.length)]);
          const index = newDeck.findIndex(card => card === selected);
          newHand.push(selected);
          newDeck.splice(index, 1);
        }
    
        this.setDeck(newDeck);
        this.setHand(newHand);
      }
    
      playCard(card, index, field, hand, playerPP) {
        if (this.getField().length >= 3) {
          alert("これ以上出せません（最大3体）");
          return { success: false };
        }
    
        const newField = [
          ...this.getField(),
          {
            ...card,
            currentHp: card.hp,
            animate: true,
            attacked: false,
            canAttack: false,
            rareEffect: card.rarity === "SSR" || card.rarity === "UR",
            uid: card.uid || `${card.name}-${Date.now()}-${Math.random()}`,
          },
        ];
        const newHand = hand.filter((_, i) => i !== index);
    
        this.setField(newField);
        this.setHand(newHand);
    
        return { success: true };
      }
    
      enemyPlayCards() {
        console.log("enemyPlayCards: level=", this.aiLevel);
        const aiFunc = enemyAI[this.aiLevel];
        if (aiFunc) {
          aiFunc(this);
        } else {
          console.warn("AI関数が見つかりません: ", this.aiLevel);
        }
      }
      
  
    generateDeck(size, baseCards) {
      const deck = [];
      for (let i = 0; i < size; i++) {
        deck.push({ ...baseCards[i % baseCards.length] });
      }
      this.setDeck(deck);
      return deck;
    }
  
    containsLowPPCards(cards, maxPP = 3) {
      return cards.some(card => card.pp <= maxPP);
    }
  

    handleMulligan(deck, mulliganCount) {
        let newDeck = [...deck];
        let drawn;
        do {
            drawn = newDeck.splice(0, 5);
        } while (!this.containsLowPPCards(drawn) && mulliganCount === 3);
        this.setDeck(newDeck);
        this.setHand(drawn);
    }

    drawEnemyInitialHand(deckSource) {
        const drawn = deckSource.slice(0, 5);
        this.setEnemyDeck(deckSource.slice(5));
        this.setEnemyHand(drawn);
    }

    startGame() {
        this.setField([]);
        this.setEnemyField([]);
        this.setTurn(1);
    }
    

getPPRestriction(turn) {
    if (turn <= 6) return 3;
    if (turn <= 20) return 7;
    return Infinity;
  }
  

  handleAttack(attackerIndex, targetIndex) {
    const field = this.getField();
    const enemyField = this.getEnemyField();
    const log = [];
  
    const attacker = field[attackerIndex];
    const target = enemyField[targetIndex];
  
    if (!attacker || !target) return;
  
    // 攻撃処理
    const damage = attacker.ap;
    target.currentHp -= damage;
  
    log.push({ type: "player", text: `${attacker.name} が ${target.name} に ${damage} ダメージ！` });
  
    const newEnemyField = [...enemyField];
    const newField = [...field];
    const newEnemyGraveyard = this.getEnemyGraveyard();
    let newEnemyPP = this.getEnemyPP();
  
    if (target.currentHp <= 0) {
      log.push({ type: "player", text: `${target.name} を撃破！PP-${target.pp}` });
      newEnemyPP -= target.pp;
      newEnemyGraveyard.push(target);
      newEnemyField.splice(targetIndex, 1);
    }
  
    newField[attackerIndex] = { ...attacker, attacked: true };
  
    // 更新
    this.setField(newField);
    this.setEnemyField(newEnemyField);
    this.setEnemyGraveyard(newEnemyGraveyard);
    this.setEnemyPP(Math.max(0, newEnemyPP));
    this.setLog(prev => [...prev, ...log]);
    this.checkGameEnd();
  }

  enemyAttack() {
    const field = this.getField();
    const enemyField = this.getEnemyField();
    let pp = this.getPlayerPP();
    const graveyard = this.getGraveyard();
    const log = [];
  
    const newField = [...field];
    const newGraveyard = [...graveyard];
  
    enemyField.forEach((attacker) => {
      if (!attacker.canAttack) return;
      if (newField.length > 0) {
        newField[0].currentHp -= attacker.ap;
        log.push({ type: "enemy", text: `${attacker.name} が ${newField[0].name} に ${attacker.ap} ダメージ！` });
  
        if (newField[0].currentHp <= 0) {
          log.push({ type: "enemy", text: `${newField[0].name} が倒された！PP-${newField[0].pp}` });
          pp -= newField[0].pp;
          newGraveyard.push(newField[0]);
          newField.shift(); // 倒されたカードを削除
        }
      }
    });
  
    this.setField(newField);
    this.setPlayerPP(Math.max(0, pp));
    this.setGraveyard(newGraveyard);
    this.setLog(prev => [...prev, ...log]);
  
    this.checkGameEnd();
  }
  
  
  checkGameEnd() {
    const playerPP = this.getPlayerPP();
    const enemyPP = this.getEnemyPP();
  
    if (playerPP <= 0) {
      this.setGameResult("lose");
      this.setLog(prev => [...prev, { type: "system", text: "あなたのPPが0になった！敗北！" }]);
    } else if (enemyPP <= 0) {
      this.setGameResult("win");
      this.setLog(prev => [...prev, { type: "system", text: "相手のPPが0になった！勝利！" }]);
    }
  }
  
  
}
  