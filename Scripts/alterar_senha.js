//Feito por Giovana Uchelli - 25008818

async function alterarSenha() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const novaSenha = document.getElementById("senha").value;

        if (!novaSenha) {
            alert("Digite a nova senha!");
            return;
        }

        const res = await fetch("http://localhost:3000/redefinir-senha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, novaSenha }),
        });

        const data = await res.json();
        alert(data.message || data.error);

        if (res.ok) {
            window.location.href = "login.html"; // volta pra tela de login
        }
        }