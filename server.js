

// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 必要に応じて制限
  },
});

const rooms = {};
const gameState = {};

io.on("connection", (socket) => {
  console.log("接続:", socket.id);

  socket.on("playCard", ({ roomId, card, index, role }) => {
    socket.to(roomId).emit("opponentPlayedCard", {
        card,
        index,
        role,
    });
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    }
    console.log("切断:", socket.id);
  });

    socket.on("joinRoom", (roomId) => {
        if (!rooms[roomId]) rooms[roomId] = [];
    
        rooms[roomId].push(socket.id);
        socket.join(roomId);
    
        const playerNumber = rooms[roomId].length === 1 ? "player1" : "player2";
        socket.emit("playerRole", playerNumber); // ← 自分の立場を通知
    
        console.log(`Room ${roomId}:`, rooms[roomId]);
    
        if (rooms[roomId].length === 2) {
            gameState[roomId] = { turn: "player1" };
            io.to(roomId).emit("gameStart", { firstTurn: "player1" });
        }
    });

    // ターンエンド処理
    socket.on("endTurn", ({ roomId }) => {
        if (!gameState[roomId]) return;
    
        const current = gameState[roomId].turn;
        const next = current === "player1" ? "player2" : "player1";
        gameState[roomId].turn = next;
    
        io.to(roomId).emit("turnChanged", { currentTurn: next });
    });
  

    socket.on("attack", ({ roomId, attackerName, damage }) => {
        socket.to(roomId).emit("attacked", { attackerName, damage });
      });
      
    socket.on("attackRequest", ({ roomId, attacker, targetIndex, role }) => {
        const targetRole = role === "player1" ? "player2" : "player1";
        const room = gameState[roomId];
        if (!room) return;

        const field = room.fields[targetRole];
        const target = field[targetIndex];
        if (!target) return;
            target.hp -= attacker.ap;
        let logs = [`${attacker.name} が ${target.name} に ${attacker.ap} ダメージ！`];

        if (target.hp <= 0) {
            logs.push(`${target.name} を撃破！PP-${target.pp}`);
            field.splice(targetIndex, 1);

            room[`${targetRole}PP`] -= target.pp;

        if (room[`${targetRole}PP`] <= 0) {
            io.to(roomId).emit("gameEnd", {
                winner: role,
                loser: targetRole,
            });
          }
        }

    io.to(roomId).emit("updateField", {
        fields: room.fields,
        pp: {
            player1: room.player1PP,
            player2: room.player2PP,
        },
    });

    socket.to(roomId).emit("receiveAttack", {
        attacker,
        targetIndex,
    });
        
    io.to(roomId).emit("log", { text: logs.join("\n") });
});
  

    socket.emit("playCard", {
        roomId: "roomId",
        card,
        index,
        role,
    });
  
});

server.listen(3001, () => {
  console.log("サーバー起動: http://localhost:3001");
});
