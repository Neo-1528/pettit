import React from "react";

export default function Battle({ log }) {
    return (
         <div className="mt-6">
         <h2 className="text-lg font-semibold mb-2">戦闘ログ</h2>
         <div className="bg-white border rounded p-2 h-40 overflow-y-auto text-sm whitespace-pre-wrap">
           {log.slice(-10).map((entry, idx) => (
             <div
               key={idx}
               className={`${entry.type === 'player' ? 'text-blue-600' : 'text-red-600'} ${
                 entry.text.includes('撃破') || entry.text.includes('倒された') ? 'font-bold uppercase' : ''
               }`}
             >
               ・{entry.text}
             </div>
           ))}
         </div>
       </div>
    );
}