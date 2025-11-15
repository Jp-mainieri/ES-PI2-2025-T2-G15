async function enviarRecuperacao() {
        const btn = document.querySelector('.btn-entrar');
        try {
            btn.disabled = true;
            const email = document.getElementById('email').value;
            if (!email) return alert('Digite um email válido.');

            const res = await fetch("http://localhost:3000/recuperar-senha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            });

            // Se redeu erro (ex: 404), isso pega o corpo e exibe
            let data;
            try { data = await res.json(); } catch (e) { data = { error: 'Resposta inválida do servidor.' }; }

            if (!res.ok) {
            alert(data.error || `Erro ${res.status}`);
            console.error('Resposta /recuperar-senha:', res.status, data);
            } else {
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