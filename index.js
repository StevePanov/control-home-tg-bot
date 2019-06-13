var express = require("express");
var TelegramBot = require("node-telegram-bot-api");

var token = process.env.TG_TOKEN;
var bot = new TelegramBot(token, { polling: true });
var app = express();

var chatsId = [];

var hall = 1; //данные датчика Холла
var infrared = 0; //данные ИК датчика
var mq2 = 0; //данные mq2
var mq4 = 0; //данные mq4
var temp = 0;
var humidity = 0;

var history = {
  //хранение времени и даты для статистики
  hall: {
    HIGH: [],
    LOW: []
  },
  infrared: {
    HIGH: [],
    LOW: []
  },
  mq2: {
    HIGH: [],
    LOW: []
  },
  mq4: {
    HIGH: [],
    LOW: []
  }
};

bot.onText(
  /\/start/,
  (onText = msg => {
    console.log("/start пришло сообщение");
    if (chatsId.indexOf(msg.chat.id) != -1) {
      bot.sendMessage(msg.chat.id, "Вы уже подписаны");
    } else {
      chatsId = Array.from(new Set([...chatsId, msg.chat.id]));
      bot.sendMessage(msg.chat.id, "Вы подписались на уведомления");
    }
  })
);

bot.onText(
  /\/дверь/,
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
  /\/движение/,
  (onText = msg => {
    console.log("/движение  пришло сообщение, infrared: ", infrared);
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
  /\/дым/,
  (onText = msg => {
    console.log("/дым  пришло сообщение, mq2: ", mq2);
    if (mq2 === 1) {
      chatsId.map(id => {
        bot.sendMessage(id, "Задымление ❗️❗️❗️");
      });
    } else {
      chatsId.map(id => {
        bot.sendMessage(id, "Дым не обнаружен");
      });
    }
  })
);

bot.onText(
  /\/газ/,
  (onText = msg => {
    console.log("/газ  пришло сообщение, mq4: ", mq4);
    if (mq4 === 1) {
      chatsId.map(id => {
        bot.sendMessage(id, "Обнаружена утечка газа ❗️ ❗️ ❗️️");
      });
    } else {
      chatsId.map(id => {
        bot.sendMessage(id, "Утечка газа не зафиксирована");
      });
    }
  })
);

bot.onText(
  /\/температура/,
  (onText = msg => {
    console.log("/temp  пришло сообщение, temp: ", temp);
    chatsId.map(id => {
      bot.sendMessage(id, `Температура: ${temp} градусов`);
    });
  })
);

bot.onText(
  /\/влажность/,
  (onText = msg => {
    console.log("/humidity  пришло сообщение, humidity: ", humidity);
    chatsId.map(id => {
      bot.sendMessage(id, `Влажность: ${humidity}%`);
    });
  })
);

bot.onText(
  /\/статистика/,
  (onText = msg => {
    chatsId.map(id => {
      bot.sendMessage(
        id,
        `Всего изменений: ${history.hall.HIGH.length +
          history.hall.LOW.length +
          history.infrared.HIGH.length +
          history.infrared.LOW.length +
          history.mq2.HIGH.length +
          history.mq2.LOW.length +
          history.mq4.HIGH.length +
          history.mq4.LOW.length}`
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
      history.hall.HIGH.push(new Date());
    } else {
      chatsId.map(id => {
        bot.sendMessage(id, "Дверь закрыта");
      });
      hall = req.headers.hall;
      history.hall.LOW.push(new Date());
    }
  }
  res.sendStatus(200);
});

app.get("/infrared", (req, res) => {
  console.log("Запрос /infrared, req.headers.infrared: ", req.headers.infrared);

  if (infrared != req.headers.infrared) {
    if (req.headers.infrared == 1) {
      chatsId.map(id => {
        bot.sendMessage(id, "Движение обнаружено");
      });
      infrared = req.headers.infrared;
      history.infrared.HIGH.push(new Date());
    } else {
      chatsId.map(id => {
        bot.sendMessage(id, "Движение не обнаружено");
      });
      infrared = req.headers.infrared;
      history.infrared.LOW.push(new Date());
    }
  }
  res.sendStatus(200);
});

app.get("/mq2", (req, res) => {
  console.log("Запрос /mq2, req.headers.mq2: ", req.headers.mq2);

  if (mq2 != req.headers.mq2) {
    if (req.headers.mq2 == 1) {
      chatsId.map(id => {
        bot.sendMessage(id, "Обнаружен дым");
      });
      mq2 = req.headers.mq2;
      history.mq2.HIGH.push(new Date());
    } else {
      mq2 = req.headers.mq2;
      history.mq2.LOW.push(new Date());
    }
  }
  res.sendStatus(200);
});

app.get("/mq4", (req, res) => {
  console.log("Запрос /mq4, req.headers.mq4: ", req.headers.mq4);

  if (mq4 != req.headers.mq4) {
    if (req.headers.mq4 == 1) {
      chatsId.map(id => {
        bot.sendMessage(id, "Обнаружена утечка газа");
      });
      mq4 = req.headers.mq4;
      history.mq4.HIGH.push(new Date());
    } else {
      mq4 = req.headers.mq4;
      history.mq4.LOW.push(new Date());
    }
  }
  res.sendStatus(200);
});

app.get("/temp", (req, res) => {
  console.log(
    "Запрос /temp, req.headers.temp & humidity: ",
    typeof req.headers.temp,
    typeof req.headers.humidity,
    temp,
    Number(req.headers.temp)
  );

  if (temp != req.headers.temp || humidity != req.headers.humidity) {
    temp = req.headers.temp;
    humidity = req.headers.humidity;
    if (Number(req.headers.temp) < 15) {
      chatsId.map(id => {
        bot.sendMessage(id, `Низкая температура: ${req.headers.temp} градусов`);
      });
    }
    if (Number(req.headers.humidity) > 70) {
      chatsId.map(id => {
        bot.sendMessage(id, `Повышенная влажность: ${req.headers.temp}%`);
      });
    }
  }
  res.sendStatus(200);
});

app.get("/test", (req, res) => {
  console.log("Запрос /test | ", req.headers.test);
  res.sendStatus(200);
});

// app.listen(3000, () => {
//   console.log("Example app listening on port 3000!");
// });
const host = "0.0.0.0";
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
  console.log("Listening on Port ", port);
});
