document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, senha })
            });

            if (response.ok) {
                const usuario = await response.json();
                // Salva info do usuário no sessionStorage
                sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                window.location.href = "dash.html"; // redireciona para página interna
            } else {
                const erro = await response.json();
                alert(erro.error || "Email ou senha incorretos!");
            }
        } catch (err) {
            console.error(err);
            alert("Erro de conexão com o servidor.");
        }
    });
});
