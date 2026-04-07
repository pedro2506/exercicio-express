import { useState } from "react";

function App() {
  // 🔐 estados do login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [token, setToken] = useState("");

  // 📦 👉 COLOCA AQUI (produtos)
  const [produtos, setProdutos] = useState([]);

  // 🔐 login
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
      alert("Login feito!");
    } else {
      alert("Erro no login");
    }
  };

  // 📦 👉 COLOCA AQUI (função)
  const carregarProdutos = async () => {
    const res = await fetch("https://exercicio-express.onrender.com/produtos");
    const data = await res.json();
    setProdutos(data);
  };

  return (
    <div>
      <h1>Login</h1>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={(e) => setSenha(e.target.value)} />

      <button onClick={login}>Entrar</button>

      {token && <p>Logado ✅</p>}

      {/* 📦 BOTÃO */}
      <button onClick={carregarProdutos}>Carregar Produtos</button>

      {/* 📦 LISTA */}
      <ul>
        {produtos.map((p) => (
          <li key={p.id}>
            {p.nome} - R$ {p.preco}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;