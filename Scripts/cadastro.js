//Feito por laura Carvalho - 25014543

// Aguarda todo o HTML ser carregado antes de rodar o script
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro"); // Captura o formulário de cadastro

  // Adiciona o evento de "submit" ao formulário
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Coleta os valores digitados nos campos e remove espaços extras
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value.trim();

    // Verifica se algum campo está vazio
    if (!nome || !email || !telefone || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      // Envia os dados ao servidor via requisição POST
      const response = await fetch("http://localhost:3000/professores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, telefone, senha, email }) // Converte os dados para JSON
      });

      // Se o servidor retornou status 200–299, cadastro foi bem-sucedido
      if (response.ok) {
        const data = await response.json();
        alert("Cadastro realizado com sucesso!");
        console.log("Professor cadastrado:", data);
        form.reset(); // Limpa o formulário após cadastrar
      } else { 
        // Caso o servidor retorne erro (400, 500 etc.)
        const error = await response.json();
        alert(`Erro: ${error.error || "Falha ao cadastrar."}`);
      }
    } catch (err) { 
      // Erros que acontecem caso o servidor esteja offline ou a requisição falhe
      console.error("Erro ao enviar os dados:", err);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
