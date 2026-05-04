const express = require('express');
const app = express();
const router = require('./routes/router');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API SERPE funcionando 🚀");
});

// Rotas
app.use(router);

// Middleware Global de Erros (sempre após as rotas)
app.use(errorHandler);

// EXPORTE APENAS O APP (SEM O LISTEN)
module.exports = app;