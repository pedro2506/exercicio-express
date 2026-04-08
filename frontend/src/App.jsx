import { useState, useEffect } from "react";

function App() {
  // 🔐 login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // 📦 produtos
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  // 📝 formulário
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

  // ➕ CRIAR PRODUTO
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

  // ✏️ EDITAR PRODUTO
  const editarProduto = (produto) => {
    setNome(produto.nome);
    setPreco(produto.preco);
    setCategoria(produto.categoria);
    setEditandoId(produto.id);
  };

  // 🔄 ATUALIZAR PRODUTO (PUT)
  const atualizarProduto = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://exercicio-express.onrender.com/produtos/${editandoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          nome,
          preco: Number(preco),
          categoria
        })
      }
    );

    if (res.status === 200) {
      alert("Produto atualizado!");
      setEditandoId(null);
      setNome("");
      setPreco("");
      setCategoria("");
      carregarProdutos();
    } else {
      alert("Erro ao atualizar");
    }
  };

  const deletarProduto = async (id) => {
  const confirmar = window.confirm("Tem certeza que deseja excluir?");

  if (!confirmar) return;

  const token = localStorage.getItem("token");

  const res = await fetch(
    `https://exercicio-express.onrender.com/produtos/${id}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    }
  );

  if (res.status === 200) {
    alert("Produto deletado!");
    carregarProdutos();
  } else {
    alert("Erro ao deletar");
  }
};

  // 🔄 carregar automaticamente quando logado
  useEffect(() => {
    const buscar = async () => {
      if (!token) return;

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

          {/* FORMULÁRIO */}
          <h2>{editandoId ? "Editar Produto" : "Novo Produto"}</h2>

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

          <br /><br />

          {editandoId ? (
            <button onClick={atualizarProduto}>Atualizar</button>
          ) : (
            <button onClick={salvarProduto}>Salvar</button>
          )}

          <hr />

          {/* LISTA */}
          <h2>Produtos</h2>

          <button onClick={carregarProdutos}>Atualizar lista</button>

          <ul>
            {produtos.map((p) => (
              <li key={p.id}>
                {p.nome} - R$ {p.preco} ({p.categoria})

                <button onClick={() => editarProduto(p)}>
                  Editar
                </button>

                <button onClick={() => deletarProduto(p.id)}>
                  Excluir
                  </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;