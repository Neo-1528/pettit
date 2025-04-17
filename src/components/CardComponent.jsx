
import React from "react";

const abilityEffects = {
  "式降ノ禁詠": "式神2体即時召喚＆即行動可",
  "封呪開印ノ秘式": "敵全体のプチスキルを封印",
};

const rarityTextColors = {
  N: "text-gray-600",
  R: "text-blue-600",
  SR: "text-yellow-600",
  SSR: "text-purple-600",
  UR: "text-pink-600"
};

export default function CardComponent({
  imageSrc,
  name,
  pp,
  hp,
  ap,
  abilities,
  flavor,
  rarity 
}) {
  const showEffect = (abilityName) => {
    alert(`${abilityName}\n${abilityEffects[abilityName] || "効果情報が未登録です"}`);
  };

  const nameColor = rarityTextColors[rarity || "N"] || "text-white";

  return (
    <div className="relative w-[250px] h-[360px] text-white font-bold">
  {imageSrc && (
    <img
      src={imageSrc}
      alt={name}
      className="absolute w-full h-full object-cover rounded-xl"
    />
  )}

  {/* 名前（上部中央） */}
  <div className={`absolute top-[12px] left-1/2 -translate-x-1/2 text-lg drop-shadow ${nameColor}`}>
    {name}
  </div>

  {/* PPタグ（左上吊り下げ風） */}
  <div className="absolute top-[40px] left-[24px] bg-yellow-500 px-2 py-0.5 rounded drop-shadow rotate-[-20deg]">
   {pp}
  </div>

  {/* HP・AP（左下） */}
  <div className="absolute bottom-[90px] left-[24px] bg-red-600 px-2 py-0.5 rounded drop-shadow">
    {hp}
  </div>
  <div className="absolute bottom-[55px] left-[24px] bg-blue-600 px-2 py-0.5 rounded drop-shadow">
    {ap}
  </div>

  {/* アビリティ（右中央2段） */}
  {abilities?.[0] && (
    <div
      className="absolute top-[160px] right-[24px] bg-black/70 px-2 py-1 text-xs rounded cursor-pointer hover:bg-black"
      onClick={() => showEffect(abilities[0])}
    >
      {abilities[0]}
    </div>
  )}
  {abilities?.[1] && (
    <div
      className="absolute top-[190px] right-[24px] bg-black/70 px-2 py-1 text-xs rounded cursor-pointer hover:bg-black"
      onClick={() => showEffect(abilities[1])}
    >
      {abilities[1]}
    </div>
  )}

  {/* フレーバーテキスト（最下部中央） */}
  {flavor && (
    <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 text-xs text-center w-[90%] text-shadow">
      {flavor}
    </div>
  )}
</div>
  );
} 
