const pool = require("./src/config/database");

pool.connect()
  .then(() => {
    console.log("Banco conectado com sucesso 🚀");
  })
  .catch(err => {
    console.error("Erro ao conectar no banco:", err);
  });