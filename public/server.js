const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

});

// 🔌 Conexão com MySQL (Railway + fallback local)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "maglev.proxy.rlwy.net",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "AgVaJAMljqcCjnIKZVmVirvPKBVoBmEp",
  database: process.env.DB_NAME || "railway",
  port: process.env.DB_PORT || 43906
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL: " + err.message);
  } else {
    console.log("MySQL Conectado!");
  }
});

// 🔐 SEGREDO JWT
const SECRET = "segredo";

// 🛑 Middleware de validação
function validarProduto(req, res, next) {
  let { nome, preco, categoria } = req.body;

  preco = Number(preco);

  if (!nome || isNaN(preco) || !categoria) {
    return res.status(400).json({ erro: "Dados inválidos ou categoria ausente" });
  }

  req.body.preco = preco;
  next();
}

// 🔐 Middleware de autenticação
function autenticar(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const token = auth.split(" ")[1];

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido" });
  }
}

// 🔐 LOGIN (simples)
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (email !== "t3pedropaulo@gmail.com" || senha !== "q1w2e3r4") {
    return res.status(401).json({ erro: "Usuário inválido" });
  }

  const token = jwt.sign({ id: 1 }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

// 🔎 GET - listar produtos
app.get("/produtos", (req, res) => {
  db.query("SELECT * FROM produtos", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ➕ POST - criar produto (protegido)
app.post("/produtos", autenticar, validarProduto, (req, res) => {
  const { nome, preco, categoria } = req.body;

  db.query(
    "INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)",
    [nome, preco, categoria],
    (err, result) => {
      if (err) {
        console.log("ERRO SQL:", err);
        return res.status(500).json(err);
      }

      res.status(201).json({
        id: result.insertId,
        nome,
        preco,
        categoria
      });
    }
  );
});

// ✏️ PUT - atualizar produto (protegido)
app.put("/produtos/:id", autenticar, validarProduto, (req, res) => {
  const { id } = req.params;
  const { nome, preco, categoria } = req.body;

  db.query(
    "UPDATE produtos SET nome = ?, preco = ?, categoria = ? WHERE id = ?",
    [nome, preco, categoria, id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: "Produto não encontrado" });
      }

      res.json({ id, nome, preco, categoria });
    }
  );
});

// ❌ DELETE - remover produto (protegido)
app.delete("/produtos/:id", autenticar, (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM produtos WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: "Produto não encontrado" });
      }

      res.json({ mensagem: "Produto removido com sucesso" });
    }
  );
});

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// 🚀 Servidor
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});