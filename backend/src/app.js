const express = require('express');
const app = express();
const router = require('./routes/router');
const cors = require('cors');

// Middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API SERPE funcionando 🚀");
});

// Rotas
app.use(router);

// EXPORTE APENAS O APP (SEM O LISTEN)
module.exports = app;