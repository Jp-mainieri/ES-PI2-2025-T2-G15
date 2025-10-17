// === Abrir modal ===
document.querySelector('.btn-exportar').addEventListener('click', function() {
    abrirModal('modalExportar');
  });
  
  function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
  }
  
  function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
  }
  
  // === Envio do formulário ===
  document.getElementById('formExportarNotas').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const instituicao = document.getElementById('instituicaoExportar').value;
    const curso = document.getElementById('cursoExportar').value;
    const turma = document.getElementById('turmaExportar').value;
    const formato = document.querySelector('input[name="formato"]:checked').value;
  
    if (!instituicao || !curso || !turma) {
      alert('Por favor, preencha todos os campos antes de exportar.');
      return;
    }
  
    alert(`Exportando notas da turma ${turma} (${formato.toUpperCase()})...`);
    fecharModal('modalExportar');
    this.reset();
  });
  