//Feito por Giovana Uchelli - 25008818

// Função que envia o token e a nova senha para o backend
async function alterarSenha() {

        // pega o token da URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        // pega a nova senha digitada
        const novaSenha = document.getElementById("senha").value;

        if (!novaSenha) {
            alert("Digite a nova senha!");
            return;
        }

        // envia token + nova senha para o servidor
        const res = await fetch("http://localhost:3000/redefinir-senha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, novaSenha }),
        });
        
        // tenta ler a resposta do backend
        const data = await res.json();
        alert(data.message || data.error);

        if (res.ok) {
            window.location.href = "login.html"; // volta pra tela de login
        }
        }