import { useState, useEffect } from "react";

function App() {
  // 🔐 login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // 📦 produtos
  const [produtos, setProdutos] = useState([]);

  // 📝 novo produto
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");

  // 🔐 LOGIN
  const login = async () => {
    const res = await fetch("https://exercicio-express.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      alert("Login realizado!");
    } else {
      alert("Erro no login");
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setProdutos([]);
  };

  // 📦 LISTAR PRODUTOS
  const carregarProdutos = async () => {
    const res = await fetch("https://exercicio-express.onrender.com/produtos");
    const data = await res.json();
    setProdutos(data);
  };

  // ➕ CRIAR PRODUTO (PROTEGIDO)
  const salvarProduto = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://exercicio-express.onrender.com/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        nome,
        preco: Number(preco),
        categoria
      })
    });

    if (res.status === 201) {
      alert("Produto cadastrado!");
      setNome("");
      setPreco("");
      setCategoria("");
      carregarProdutos();
    } else {
      alert("Erro ao cadastrar");
    }
  };

  // 🔄 carrega produtos automaticamente quando loga
  useEffect(() => {
    const buscar = async () => {
    if (token) return;

   const res = await fetch("https://exercicio-express.onrender.com/produtos");
    const data = await res.json();
    setProdutos(data);
  };

  buscar();
}, [token]);

  return (
    <div style={{ padding: 20 }}>
      <h1>📦 Sistema de Estoque</h1>

      {/* 🔐 LOGIN */}
      {!token && (
        <>
          <h2>Login</h2>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Senha"
            type="password"
            onChange={(e) => setSenha(e.target.value)}
          />

          <br /><br />

          <button onClick={login}>Entrar</button>
        </>
      )}

      {/* 🔓 SISTEMA */}
      {token && (
        <>
          <p>Logado ✅</p>
          <button onClick={logout}>Sair</button>

          <hr />

          {/* ➕ CADASTRO */}
          <h2>Novo Produto</h2>

          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            placeholder="Preço"
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />

          <input
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          <button onClick={salvarProduto}>Salvar</button>

          <hr />

          {/* 📦 LISTA */}
          <h2>Produtos</h2>

          <button onClick={carregarProdutos}>Atualizar</button>

          <ul>
            {produtos.map((p) => (
              <li key={p.id}>
                {p.nome} - R$ {p.preco} ({p.categoria})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;