//Feito por laura Carvalho - 25014543

// Aguarda todo o HTML ser carregado antes de rodar o JS
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin"); // Obtém o formulário de login pelo ID

    // Adiciona o evento de "submit" ao formulário
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Pega os valores digitados nos campos
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        // Validação simples: impede envio com campos vazios
        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        try { 
            // Envia requisição POST para o backend /login
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, senha })
            });

            // Se o servidor retornou status 200–299, foi bem-sucedido
            if (response.ok) {
                const usuario = await response.json();

                // Salva info do usuário no sessionStorage
                sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                window.location.href = "dash.html"; // Redireciona para a dashboard após login bem-sucedido
            } else { 
                // Mostra mensagem de erro enviada pelo backend OU erro padrão
                const erro = await response.json();
                alert(erro.error || "Email ou senha incorretos!");
            }
        } catch (err) {
            // Quando não consegue se conectar ao servidor (server offline, etc.)
            console.error(err);
            alert("Erro de conexão com o servidor.");
        }
    });
});
