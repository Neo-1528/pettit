
const awaAI = (game) => {
  const hand = game.getEnemyHand();
  const field = game.getEnemyField();
  const pp = game.getEnemyPP();
  const newHand = [...hand];
  const newField = [...field];

  if (field.length >= 3) return;

  const playable = newHand.filter(card => card.pp <= pp);
  if (playable.length > 0) {
    const selected = playable[Math.floor(Math.random() * playable.length)];
    newField.push({
      ...selected,
      currentHp: selected.hp,
      animate: true,
      canAttack: false,
      uid: selected.uid || `${selected.name}-${Date.now()}-${Math.random()}`,
    });
    const index = newHand.findIndex(card => card === selected);
    newHand.splice(index, 1);
  }

  game.setEnemyHand(newHand);
  game.setEnemyField(newField);
};

export default awaAI;
