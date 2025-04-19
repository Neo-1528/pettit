
import React from "react";

export default function CardComponent({ imageSrc }) {
  return (
    <div className="w-[250px] h-[360px]">
      <img
        src={imageSrc}
        alt="カード画像"
        className="w-full h-full object-cover rounded-xl shadow-lg"
      />
    </div>
  );
}
