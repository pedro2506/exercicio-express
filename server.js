const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importante para o Codespaces
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors()); // Libera o acesso para o navegador
app.use(express.static("public"));

// 🔌 Conexão com MySQL
// Ajustado para 127.0.0.1 para evitar erros de IPv6 no Codespaces
const db = mysql.createConnection({
  host: "maglev.proxy.rlwy.net", 
  user: "root",
  password: "AgVaJAMljqcCjnIKZVmVirvPKBVoBmEp",
  database: "railway",
  port: 43906
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL: " + err.message);
  } else {
    console.log("MySQL Conectado!");
  }
});

// 🛑 Middleware de validação
function validarProduto(req, res, next) {
  let { nome, preco, categoria } = req.body;
  preco = Number(preco); // 👈 converte aqui
  if (!nome || isNaN(preco) || !categoria) {
    return res.status(400).json({ erro: "Dados inválidos ou categoria ausente" });
  }
  req.body.preco = preco; // 👈 garante número
  next();
}

// 🔎 GET - listar produtos
app.get("/produtos", (req, res) => {
  db.query("SELECT * FROM produtos", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ➕ POST - criar produto
app.post("/produtos", validarProduto, (req, res) => {
  const { nome, preco, categoria } = req.body;
  db.query("INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)", 
    [nome, preco, categoria], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, nome, preco, categoria });
  });
});

// ✏️ PUT - atualizar produto
app.put("/produtos/:id", validarProduto, (req, res) => {
  const { id } = req.params;
  const { nome, preco, categoria } = req.body;
  db.query("UPDATE produtos SET nome = ?, preco = ?, categoria = ? WHERE id = ?", 
    [nome, preco, categoria, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id, nome, preco, categoria });
  });
});

// ❌ DELETE - remover produto
app.delete("/produtos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM produtos WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Não encontrado" });
    res.json({ mensagem: "Removido com sucesso" });
  });
});

// 🚀 Servidor
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});