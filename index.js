var express = require("express");
var TelegramBot = require("node-telegram-bot-api");

var token = "805688787:AAFcAH_VfGKaET1X04AUMUgKWTdx7MNYX50";
var bot = new TelegramBot(token, { polling: true });
var app = express();

var chatsId = [];

var hall = 1; //данные датчика Холла
var infrared = 0; //данные ИК датчика

var history = {
  //хранение времени и даты для статистики
  hall: {
    HIGH: [],
    LOW: []
  },
  infrared: {
    HIGH: [],
    LOW: []
  }
};

bot.onText(
  /\/start/,
  (onText = msg => {
    console.log("/start пришло сообщение, chatsId: ", chatsId);
    if (chatsId.indexOf(msg.chat.id) != -1) {
      bot.sendMessage(msg.chat.id, "Вы уже подписаны");
    } else {
      chatsId = Array.from(new Set([...chatsId, msg.chat.id]));
      bot.sendMessage(msg.chat.id, "Вы подписались на уведомления");
    }
  })
);

bot.onText(
  /\/door/,
  (onText = msg => {
    console.log("/door  пришло сообщение, hall: ", hall);
    if (hall === 0) {
      chatsId.map(id => {
        bot.sendMessage(id, "Дверь открыта");
      });
    } else {
      chatsId.map(id => {
        bot.sendMessage(id, "Дверь закрыта");
      });
    }
  })
);
bot.onText(
  /\/space/,
  (onText = msg => {
    console.log("/space  пришло сообщение, infrared: ", infrared);
    if (infrared === 1) {
      chatsId.map(id => {
        bot.sendMessage(id, "В зоне датчика движение");
      });
    } else {
      chatsId.map(id => {
        bot.sendMessage(id, "В зоне датчика движение не обнажружено");
      });
    }
  })
);

bot.onText(
  /\/stats/,
  (onText = msg => {
    chatsId.map(id => {
      bot.sendMessage(
        id,
        `Всего изменений: ${history.hall.HIGH.length +
          istory.hall.LOW.length +
          history.infrared.HIGH.length +
          history.infrared.LOW.length}`
      );
    });
  })
);

app.get("/hall", (req, res) => {
  console.log("Запрос /hall, req.headers.hall: ", req.headers.hall);

  if (hall != req.headers.hall) {
    if (req.headers.hall == 0) {
      chatsId.map(id => {
        bot.sendMessage(id, "Дверь открыта");
      });
      hall = req.headers.hall;
      history.hall.HIGH.push(new Data());
    } else {
      chatsId.map(id => {
        bot.sendMessage(id, "Дверь закрыта");
      });
      hall = req.headers.hall;
      history.hall.LOW.push(new Data());
    }
  }
  res.sendStatus(200);
});

app.get("/infrared", (req, res) => {
  console.log("Запрос /infrared, req.headers.infrared: ", req.headers.infrared);

  if (infrared != req.headers.infrared) {
    if (req.headers.infrared == 1) {
      chatsId.map(id => {
        bot.sendMessage(id, "В зоне датчика движение");
      });
      infrared = req.headers.infrared;
      history.infrared.HIGH.push(new Data());
    } else {
      chatsId.map(id => {
        bot.sendMessage(id, "В зоне датчика движение не обнажружено");
      });
      infrared = req.headers.infrared;
      history.infrared.LOW.push(new Data());
    }
  }
  res.sendStatus(200);
});

app.get("/test", (req, res) => {
  console.log("Запрос /test, req.ip | req.headers: ", req.ip, req.headers);
  res.sendStatus(200);
});

// app.listen(3000, () => {
//   console.log("Example app listening on port 3000!");
// });
