
// GachaData/useGachaLogic.js
import { useEffect, useState } from "react";
import charactersData from "./gachaCharacters.json";


export function useGachaLogic(bottleCount = 9) {
  const [characters, setCharacters] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [revealedIndex, setRevealedIndex] = useState(null);
  const [gachaResult, setGachaResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [multiResult, setMultiResult] = useState([]);
  const [isKaguraTime, setIsKaguraTime] = useState(false);
  const [showMultiResult, setShowMultiResult] = useState(false);

  function weightedRandomPick(characters, isKaguraTime = false) {
    const mode = isKaguraTime ? "kagura" : "normal";
    const table = characters.flatMap((char) => {
        const weight = rarityWeights[mode][char.rarity] || 0;
        return Array(weight).fill(char);
    });
    if (table.length === 0) return null;
    const pick = table[Math.floor(Math.random() * table.length)];
    return pick;
    }

    function isWithinKaguraHour() {
        const now = new Date();
        const hour = now.getHours();
        return hour === 20;
    }

  useEffect(() => {
    setCharacters(charactersData);
  }, []);

  const shootBottle = () => {
    if (isAnimating || characters.length === 0) return;
    setIsAnimating(true);

    const hitIndex = Math.floor(Math.random() * bottleCount);
    setSelectedIndex(hitIndex);
    setTimeout(() => {
      setRevealedIndex(hitIndex);

      const result = weightedRandomPick(characters, isKaguraTime);
      setGachaResult(result);
  
      setIsAnimating(false);
    }, 1000);
  };

  const shootTenBottles = () => {
    if (isAnimating || characters.length === 0) return;

    const randomTrigger = Math.random() < 0.2;
    const timeTrigger = isWithinKaguraHour();
    const kaguraActive = randomTrigger || timeTrigger;
    setIsKaguraTime(kaguraActive);
    setIsAnimating(true);
    const results = [];
    let i = 0;

    const loop = () => {
        if (i >= 10) {
          setMultiResult([...results]);
          setShowMultiResult(true); 
          setIsAnimating(false);
          return;
        }
    const hitIndex = Math.floor(Math.random() * bottleCount);
    setSelectedIndex(hitIndex);
    setRevealedIndex(hitIndex);

    const result = weightedRandomPick(characters, kaguraActive);
    results.push(result);
    setMultiResult(results);
    i++;
    setTimeout(loop, 500); // 1秒ごとに次のキャラを表示
    };
    loop();
  };

  const reset = () => {
    setSelectedIndex(null);
    setRevealedIndex(null);
    setGachaResult(null);
    setMultiResult([]);
    setShowMultiResult(false);
    setIsAnimating(false);
    setIsKaguraTime(false);
  };

  const rarityWeights = {
    normal: {
        UR: 100,
        SSR: 0,
        SR: 0,
        R: 0,
        N: 0,
    },
    kagura: {
        UR: 5,
        SSR: 10,
        SR: 20,
        R: 30,
        N: 35,
    },
  };

  const rarityLabels = {
    N: "あわ",
    R: "しゅわ",
    SR: "ぷく",
    SSR: "ばぶ",
    UR: "まぼろし",
  };
  

  return {
    selectedIndex,
    revealedIndex,
    gachaResult,
    isAnimating,
    isKaguraTime,
    multiResult,
    showMultiResult,
    shootBottle,
    shootTenBottles,
    reset
    };
}
