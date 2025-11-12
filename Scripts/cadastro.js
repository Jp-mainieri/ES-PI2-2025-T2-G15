document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Coleta os dados do formulário
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !email || !telefone || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/professores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, telefone, senha, email })
      });

      if (response.ok) {
        const data = await response.json();
        alert("Cadastro realizado com sucesso!");
        console.log("Professor cadastrado:", data);
        form.reset();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error || "Falha ao cadastrar."}`);
      }
    } catch (err) {
      console.error("Erro ao enviar os dados:", err);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
