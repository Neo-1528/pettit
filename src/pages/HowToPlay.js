

import React from "react";

const HowToPlay = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50 px-4 py-8">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">📘 遊び方・ルール</h1>

      <section className="mb-6 text-left max-w-3xl">
        <h2 className="text-2xl font-semibold text-indigo-500 mb-2">ゲームの概要</h2>
        <p className="text-gray-700">
          『プチ☆ボトルバトル』は、キャラクターカードを使って対戦するターン制カードバトルゲームです。
          デッキを組み、相手よりも多くのPPを残して勝利を目指しましょう！
        </p>
      </section>

      <section className="mb-6 text-left max-w-3xl">
        <h2 className="text-2xl font-semibold text-indigo-500 mb-2">基本ルール</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>各プレイヤーは初期PPを50持ち、デッキは30枚で構成します。</li>
          <li>ゲーム開始時にカードを5枚引き、PP3以下のカードを最低1枚含める必要があります（最大3回引き直し可能）。</li>
          <li>毎ターンカードを1枚引き、ターンごとに引けるカードのPP制限があります。</li>
          <li>キャラカードが倒されると、そのカードのPP分だけプレイヤーのPPが減少します。</li>
          <li>相手プレイヤーのPPを先に0にしたプレイヤーが勝ちです。</li>
        </ul>
      </section>

      <section className="mb-6 text-left max-w-3xl">
        <h2 className="text-2xl font-semibold text-indigo-500 mb-2">ターンごとのPP制限</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>ターン1〜6：PP3以下のカードのみ</li>
          <li>ターン7〜20：PP7以下のカードのみ</li>
          <li>ターン21以降：PP制限なし</li>
        </ul>
      </section>

      <section className="mb-6 text-left max-w-3xl">
        <h2 className="text-2xl font-semibold text-indigo-500 mb-2">勝利のポイント</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>序盤は低PPカードを活用してフィールドを制圧しましょう。</li>
          <li>ターン後半は高PPカードの強力なアビリティを駆使して逆転を狙います。</li>
          <li>残りPP管理が勝敗を分けます。戦略的にカードを使い分けましょう。</li>
        </ul>
      </section>

      <section className="mb-6 text-left max-w-3xl">
        <h2 className="text-2xl font-semibold text-indigo-500 mb-2">特殊ルール・ヒント</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>フィールドには通常3体までしかキャラクターを出せませんが、アビリティによって増やすことができます。</li>
          <li>墓地のカードをチェックし、相手の戦略を予測しましょう。</li>
        </ul>
      </section>
    </div>
  );
};

export default HowToPlay;
