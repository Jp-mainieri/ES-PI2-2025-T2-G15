//Feito por Giovana Uchelli - 25008818

// Função que envia o email para o backend solicitar recuperação de senha.
async function enviarRecuperacao() {
        const btn = document.querySelector('.btn-entrar');
        try {
            btn.disabled = true;
            const email = document.getElementById('email').value;
            if (!email) return alert('Digite um email válido.');

            // envia o email para o backend gerar o token de recuperação
            const res = await fetch("http://localhost:3000/recuperar-senha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            });

            // tenta ler a resposta do servidor
            let data;
            try { data = await res.json(); } catch (e) { data = { error: 'Resposta inválida do servidor.' }; }

            // se o backend retornou erro
            if (!res.ok) {
                alert(data.error || `Erro ${res.status}`);
                console.error('Resposta /recuperar-senha:', res.status, data);
            } else {
                // se deu certo, avisa o usuário
                alert(data.message || 'E-mail enviado com sucesso (verifique spam).');
                console.log('Sucesso:', data);
            }
        } catch (err) {
            // Erro de rede (servidor offline, CORS, etc.)
            console.error('Fetch error:', err);
            alert('Erro de rede ao contatar o servidor. Verifique se o backend está rodando e o console do servidor.');
        } finally {
            btn.disabled = false;
        }
        }