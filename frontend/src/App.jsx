import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [token, setToken] = useState("");

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
      setToken(data.token);
      alert("Login feito!");
    } else {
      alert("Erro no login");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Senha"
        type="password"
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={login}>Entrar</button>

      {token && <p>Logado ✅</p>}
    </div>
  );
}

export default App;