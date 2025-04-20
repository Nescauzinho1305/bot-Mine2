const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

let isReconnecting = false;
let botInstance;

function startBot() {
  if (botInstance) return;

  const bot = mineflayer.createBot({
    host: 'Pedro1312111.aternos.me',
    port: 43898,
    username: 'BotServ2',
    version: false
  });

  botInstance = bot;

  const directions = ['forward', 'back', 'left', 'right'];
  let activityInterval;

  bot.on('spawn', () => {
    console.log(`✅ Bot entrou no servidor como ${bot.username}`);

    // Anti-AFK: movimento e pulo aleatórios
    activityInterval = setInterval(() => {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      bot.setControlState(direction, true);

      if (Math.random() > 0.5 && bot.entity.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }

      setTimeout(() => {
        bot.clearControlStates();
      }, 1500); // para após 1.5s
    }, 60000); // a cada 60s
  });

  function reconnect(reason = '') {
    if (!isReconnecting) {
      isReconnecting = true;
      console.log(`🔁 Reconectando em 5 segundos... Motivo: ${reason}`);
      setTimeout(() => {
        botInstance = null;
        startBot();
        isReconnecting = false;
      }, 5000);
    }
  }

  bot.on('end', () => {
    console.log('🔌 Bot foi desconectado.');
    clearInterval(activityInterval);
    reconnect('Desconectado');
  });

  bot.on('error', (err) => {
    console.log('❌ Erro no bot:', err);
    clearInterval(activityInterval);
    reconnect('Erro');
  });

  bot.on('kicked', (reason) => {
    console.log('⚠️ Bot foi kickado:', reason);
    clearInterval(activityInterval);
    reconnect('Kickado');
  });
}

startBot();

// Servidor express para manter o processo ativo
app.get('/', (req, res) => {
  res.send('🤖 Bot está online e com anti-AFK avançado!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor web rodando em http://localhost:${PORT}`);
});
