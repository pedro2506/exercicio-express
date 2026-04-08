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
  <div style={styles.container}>
    <h1 style={styles.title}>📦 Sistema de Estoque</h1>

    {!token ? (
      <div style={styles.card}>
        <h2>Login</h2>

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Senha"
          type="password"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button style={styles.button} onClick={login}>
          Entrar
        </button>
      </div>
    ) : (
      <>
        <div style={styles.header}>
          <span>Logado ✅</span>
          <button style={styles.logout} onClick={logout}>
            Sair
          </button>
        </div>

        {/* FORM */}
        <div style={styles.card}>
          <h2>{editandoId ? "Editar Produto" : "Novo Produto"}</h2>

          <input
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Preço"
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          {editandoId ? (
            <button style={styles.button} onClick={atualizarProduto}>
              Atualizar
            </button>
          ) : (
            <button style={styles.button} onClick={salvarProduto}>
              Salvar
            </button>
          )}
        </div>

        {/* LISTA */}
        <div style={styles.card}>
          <h2>Produtos</h2>

          <button style={styles.button} onClick={carregarProdutos}>
            Atualizar
          </button>

          <ul style={styles.list}>
            {produtos.map((p) => (
              <li key={p.id} style={styles.item}>
                <div>
                  <strong>{p.nome}</strong> <br />
                  R$ {p.preco} - {p.categoria}
                </div>

                <div>
                  <button
                    style={styles.edit}
                    onClick={() => editarProduto(p)}
                  >
                    Editar
                  </button>

                  <button
                    style={styles.delete}
                    onClick={() => deletarProduto(p.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )}
  </div>
);
}

const styles = {
  container: {
    fontFamily: "Arial",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
    padding: 20
  },
  title: {
    textAlign: "center",
    marginBottom: 30
  },
  card: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    maxWidth: 500,
    margin: "0 auto 20px auto",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)"
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    border: "none"
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer"
  },
  logout: {
    padding: 8,
    background: "#ef4444",
    border: "none",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    background: "#334155",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  edit: {
    marginRight: 5,
    background: "#22c55e",
    border: "none",
    padding: 5,
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer"
  },
  delete: {
    background: "#ef4444",
    border: "none",
    padding: 5,
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer"
  }
};

export default App;