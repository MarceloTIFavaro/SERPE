const express = require('express');
const app = express();
const router = require('./routes/router');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');

app.use(helmet());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API SERPE funcionando 🚀");
});

app.use(router);

app.use(errorHandler);

module.exports = app;