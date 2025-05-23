
const cards = [

  {
    id: "lifebin",
    name: "命の瓶詰",
    imageSrc: "/images/cards/lifebin.jpg",
    type: "item",
    effect: "heal",
    value: 30,
    rarity: "R",
    rarityLabel: "しゅわ",
    flavor: "回復のしゅわしゅわが詰まっている"
  },
  {
    id: "kirameki",
    name: "瓶底のきらめき",
    imageSrc: "/images/cards/kirameki.jpg",
    type: "item",
    effect: "draw",
    value: 2,
    rarity: "R",
    rarityLabel: "しゅわ",
    flavor: "底に輝くのは運命のカード…？"
  },
  {
    id: "kadobue",
    name: "怒りの角笛",
    imageSrc: "/images/cards/kadobue.jpg",
    type: "item",
    effect: "boost",
    value: 10,
    rarity: "SR",
    rarityLabel: "ぷく",
    flavor: "吹くたびに味方がブチ切れる！"
  },

  {
  type: "character",
    id: "seimei-UR",
    name: "式封神星明",
    imageSrc: "/images/cards/seimei-UR.jpg",
    pp: 9,
    hp: 90,
    ap: 22,
    rarity: "UR",
    rarityLabel: "まぼろし",
    abilities: ["式降ノ禁詠", "封呪開印ノ秘式"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "karo-LR",
    name: "黒呪ノ禍狼",
    imageSrc: "/images/cards/karo-LR.jpg",
    pp: 8,
    hp: 80,
    ap: 20,
    rarity: "UR",
    rarityLabel: "まぼろし",
    abilities: ["式降ノ禁詠", "封呪開印ノ秘式"],
    flavor: "主の命--遂行ヲ開始"
  },
  {
  type: "character",
    id: "omushi-UR",
    name: "お虫太郎",
    imageSrc: "/images/cards/omushi-UR.jpg",
    pp: 7,
    hp: 70,
    ap: 18,
    rarity: "UR",
    rarityLabel: "まぼろし",
    abilities: ["式降ノ禁詠", "封呪開印ノ秘式"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "shuko-UR",
    name: "焔猛ノ朱虎",
    imageSrc: "/images/cards/shuko-UR.jpg",
    pp: 8,
    hp: 110,
    ap: 30,
    rarity: "UR",
    rarityLabel: "まぼろし",
    abilities: ["式降ノ禁詠", "封呪開印ノ秘式"],
    flavor: "結界、開放---吼えろ我が魂！"
  },
  {
  type: "character",
    id: "goro-UR",
    name: "妖王ゴロ左衛門",
    imageSrc: "/images/cards/goro-UR.jpg",
    pp: 7,
    hp: 70,
    ap: 18,
    rarity: "UR",
    rarityLabel: "まぼろし",
    abilities: ["式降ノ禁詠", "封呪開印ノ秘式"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "reikaku-UR",
    name: "翠翼ノ霊鶴",
    imageSrc: "/images/cards/reikaku-UR.jpg",
    pp: 7,
    hp: 90,
    ap: 20,
    rarity: "UR",
    rarityLabel: "まぼろし",
    abilities: ["再生の風", "護りの羽衣"],
    flavor: "たとえ焼かれても緑は必ず蘇るんだよ"
  },
  {
  type: "character",
    id: "seiko-UR",
    name: "蒼涙ノ清狐",
    imageSrc: "/images/cards/seiko-UR.jpg",
    pp: 9,
    hp: 100,
    ap: 20,
    rarity: "UR",
    rarityLabel: "まぼろし",
    abilities: ["式降ノ禁詠", "封呪開印ノ秘式"],
    flavor: "祈りの雨よ、全てを鎮め給え--"
  },
  {
  type: "character",  id: "hadekera", name: "ハデケラトップス", pp: 9, hp: 100, ap: 28, rarity: "UR" },
  {
  type: "character", id: "yuna",  name: "水ノ式神　優糯", pp: 9, hp: 90, ap: 22, rarity: "UR", imageSrc: "/images/cards/yuna.jpg" },
  {
  type: "character", id: "hukai",  name: "木ノ式神　風廻", pp: 9, hp: 90, ap: 22, rarity: "UR", imageSrc: "/images/cards/hukai.jpg" },
  {
  type: "character", id: "guren",  name: "火ノ式神　紅蓮", pp: 9, hp: 90, ap: 22, rarity: "UR", imageSrc: "/images/cards/guren.jpg" },
  {
  type: "character", id: "eiji",  name: "影ノ式神　影時", pp: 9, hp: 90, ap: 22, rarity: "UR", imageSrc: "/images/cards/eiji.jpg" },
  {
  type: "character", id: "thirano-UR", name: "ティラノフィアマ", imageSrc: "/images/cards/thirano-UR.jpg", pp: 9, hp: 90, ap: 22, rarity: "UR",rarityLabel: "まぼろし"  },
  {
  type: "character", id: "sakko", name: "殺狐", imageSrc: "/images/cards/sakko.jpg", pp: 9, hp: 90, ap: 22, rarity: "UR",rarityLabel: "まぼろし"  },
  {
  type: "character",
    id: "kojomahu",
    name: "コジョまふ",
    imageSrc: "/images/cards/kojomahu.jpg",
    pp: 2,
    hp: 80,
    ap: 10,
    rarity: "R",
    rarityLabel: "あわ",
    abilities: ["ふゆのしっぽ"],
    flavor: "当たらなもんね！"
  },
  {
  type: "character",
    id: "kojobuki",
    name: "コジョぶき",
    imageSrc: "/images/cards/kojobuki.jpg",
    pp: 6,
    hp: 100,
    ap: 20,
    rarity: "SR",
    rarityLabel: "ぷく",
    abilities: ["シルバーフリーズ"],
    flavor: "これが雪原スタイル！"
  },
  {
  type: "character",
    id: "kojorei",
    name: "コジョレイ",
    imageSrc: "/images/cards/kojorei.jpg",
    pp: 8,
    hp: 110,
    ap: 25,
    rarity: "SSR",
    rarityLabel: "ばぶ",
    abilities: ["オーロラヴェイル"],
    flavor: "マフラーかっこいいだろ？"
  },
  {
  type: "character",
    id: "donguro",
    name: "どんぐろう",
    imageSrc: "/images/cards/donguro.jpg",
    pp: 2,
    hp: 40,
    ap: 10,
    rarity: "N",
    rarityLabel: "あわ",
    abilities: ["どんぐりましまし"],
    flavor: "またなんか入ってたっ！"
  },
  {
  type: "character",
    id: "shikatos",
    name: "鹿とする",
    imageSrc: "/images/cards/shikatos.jpg",
    pp: 4,
    hp: 90,
    ap: 20,
    rarity: "R",
    rarityLabel: "しゅわ",
    abilities: ["もしかしたら鹿"],
    flavor: "おれ鹿だよ？"
  },
  {
  type: "character",
    id: "usagi",
    name: "嘘詐欺",
    imageSrc: "/images/cards/usagi.jpg",
    pp: 5,
    hp: 60,
    ap: 10,
    rarity: "R",
    rarityLabel: "しゅわ",
    abilities: ["嘘ぴょん！"],
    flavor: "騙される方が悪いんだぴょん"
  },
  {
  type: "character",
    id: "odamausagi",
    name: "大騙嘘詐欺",
    imageSrc: "/images/cards/odamausagi.jpg",
    pp: 7,
    hp: 90,
    ap: 20,
    rarity: "SR",
    rarityLabel: "ぷく",
    abilities: ["騙しの極意"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "osaru",
    name: "おさるのモンキー",
    imageSrc: "/images/cards/osaru.jpg",
    pp: 3,
    hp: 30,
    ap: 10,
    rarity: "N",
    rarityLabel: "あわ",
    abilities: ["BANANA!!"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "monking",
    name: "モンキング",
    imageSrc: "/images/cards/monking.jpg",
    pp: 6,
    hp: 70,
    ap: 15,
    rarity: "SR",
    rarityLabel: "ぷく",
    abilities: ["バナナ帝王"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "aburacow",
    name: "脂闘牛",
    imageSrc: "/images/cards/aburacow.jpg",
    pp: 5,
    hp: 140,
    ap: 5,
    rarity: "R",
    rarityLabel: "しゅわ",
    abilities: ["脂身開放"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "guda2",
    name: "グダグダぐま",
    imageSrc: "/images/cards/guda2.jpg",
    pp: 2,
    hp: 70,
    ap: 5,
    rarity: "N",
    rarityLabel: "あわ",
    abilities: ["グダる"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "guda2bear",
    name: "グダグダべあ",
    imageSrc: "/images/cards/guda2bear.jpg",
    pp: 6,
    hp: 70,
    ap: 5,
    rarity: "SR",
    rarityLabel: "ぷく",
    abilities: ["冬眠"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "gudaweru",
    name: "グダウェルラス",
    imageSrc: "/images/cards/gudaweru.jpg",
    pp: 9,
    hp: 130,
    ap: 15,
    rarity: "UR",
    rarityLabel: "まぼろし",
    abilities: ["絶対グダグダ領域","爆睡カウンター"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "paraki",
    name: "パラキインコ",
    imageSrc: "/images/cards/paraki.jpg",
    pp: 4,
    hp: 80,
    ap: 10,
    rarity: "R",
    rarityLabel: "しゅわ",
    abilities: ["愛鳥ダンス"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "tapapan",
    name: "たぱぱんだ長",
    imageSrc: "/images/cards/tapapan.jpg",
    pp: 7,
    hp: 100,
    ap: 5,
    rarity: "SR",
    rarityLabel: "ぷく",
    abilities: ["ワンパンダ!!"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
  {
  type: "character",
    id: "gongoark",
    name: "ゴンゴアーク",
    imageSrc: "/images/cards/gongoark.jpg",
    pp: 10,
    hp: 150,
    ap: 30,
    rarity: "UR",
    rarityLabel: "まぼろし",
    abilities: ["山界震嵐","岩魂覚醒"],
    flavor: "いざ、式神、集いて神をぜんーー"
  },
];

export default cards;
