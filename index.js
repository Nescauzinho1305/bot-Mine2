const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

let isReconnecting = false;

function startBot() {
  const bot = mineflayer.createBot({
    host: 'Pedro1312111.aternos.me',
    port: 43898,
    username: 'BotServ',
    version: false
  });

  let jumpInterval;

  bot.on('spawn', () => {
    console.log(`✅ Bot entrou no servidor como ${bot.username}`);

    // Atividade para não ser kickado por inatividade
    jumpInterval = setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 5000);
  });

  function reconnect(reason = '') {
  if (!isReconnecting) {
    isReconnecting = true;
    console.log(`🔁 Reconectando em 5 segundos... Motivo: ${reason}`);
    setTimeout(() => {
      startBot();
      isReconnecting = false;
    }, 5000); // reconecta em 5 segundos
  }
}

  bot.on('end', () => {
    console.log('🔌 Bot foi desconectado.');
    clearInterval(jumpInterval);
    reconnect('Desconectado');
  });

  bot.on('error', (err) => {
    console.log('❌ Erro no bot:', err.code || err.message);
    reconnect('Erro');
  });

  bot.on('kicked', (reason) => {
    console.log('⚠️ Bot foi kickado:', reason);
    reconnect('Kickado');
  });
}

startBot();

// Servidor express para manter bot ativo em hosts grátis
app.get('/', (req, res) => {
  res.send('🤖 Bot está online e reconecta instantaneamente!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor web rodando em http://localhost:${PORT}`);
});
