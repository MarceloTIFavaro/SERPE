const express = require('express');
const app = express();
const router = require('./routes/router');

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API SERPE funcionando 🚀");
});

// Rotas
app.use(router);

// EXPORTE APENAS O APP (SEM O LISTEN)
module.exports = app;