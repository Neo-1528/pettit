
const shuwaAI = (game) => {
  const hand = game.getEnemyHand();
  const field = game.getEnemyField();
  let pp = game.getEnemyPP();
  const newHand = [...hand];
  const newField = [...field];

  if (newField.length >= 3) return;

  const playable = newHand.filter(card => card.pp <= pp);
  if (playable.length > 0) {
    playable.sort((a, b) => b.ap - a.ap);
    const selected = playable[0];
    newField.push({
      ...selected,
      currentHp: selected.hp,
      animate: true,
      canAttack: false,
      uid: Date.now() + Math.random(),
    });
    const index = newHand.findIndex(card => card === selected);
    newHand.splice(index, 1);
  }

  game.setEnemyHand(newHand);
  game.setEnemyField(newField);
};

export default shuwaAI;