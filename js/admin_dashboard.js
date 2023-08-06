// seu-arquivo-admin.js
const db = firebase.firestore();

auth.onAuthStateChanged((user) => {
  const pausaForm = document.getElementById('pausaForm');
  const pausasTable = document.getElementById('pausasTable');
  const colaboradorSelect = document.getElementById('colaborador');

  if (user) {
    // O usuário está logado, verificar se é um administrador
    // Implemente a lógica para verificar se o usuário é um administrador

    // Função para carregar os nomes dos colaboradores no menu suspenso
    function loadColaboradores() {
      const colaboradoresRef = db.collection('colaboradores');
      colaboradoresRef.onSnapshot((snapshot) => {
        colaboradorSelect.innerHTML = '<option value="" disabled selected>Selecione o colaborador</option>'; // Limpar o menu suspenso antes de atualizar
        snapshot.forEach((doc) => {
          const data = doc.data();
          const option = document.createElement('option');
          option.value = doc.id; // O ID do colaborador será o valor da opção no menu suspenso
          option.innerText = data.name; // Nome do colaborador
          colaboradorSelect.appendChild(option);
        });
      });
    }

    // Chamar a função para carregar os colaboradores assim que a página carregar
    loadColaboradores();

    // Função para carregar as pausas do colaborador selecionado
    function loadPausas(colaboradorId) {
      const pausasRef = db.collection('pausas');
      pausasRef
        .where('colaboradorId', '==', colaboradorId)
        .onSnapshot((snapshot) => {
          pausasTable.innerHTML = ''; // Limpar a tabela antes de atualizar
          snapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${data.nomeColaborador}</td>
              <td>${data.diaSemana}</td>
              <td>${data.entrada}</td>
              <td>${data.pausa1}</td>
              <td>${data.refeicao}</td>
              <td>${data.pausa2}</td>
              <td>${data.saida}</td>
            `;
            pausasTable.appendChild(tr);
          });
        });
    }

    // Atualizar a tabela de pausas ao selecionar um colaborador
    colaboradorSelect.addEventListener('change', () => {
      const colaboradorId = colaboradorSelect.value;
      if (colaboradorId) {
        loadPausas(colaboradorId);
      } else {
        pausasTable.innerHTML = ''; // Limpar a tabela se nenhum colaborador estiver selecionado
      }
    });

    // Lidar com o envio do formulário de inserir pausa
    pausaForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const colaboradorId = colaboradorSelect.value;
      const diaSemana = pausaForm.diaSemana.value;
      const entrada = pausaForm.entrada.value;
      const pausa1 = pausaForm.pausa1.value;
      const refeicao = pausaForm.refeicao.value;
      const pausa2 = pausaForm.pausa2.value;
      const saida = pausaForm.saida.value;

      // Salvar as informações da pausa no Firestore relacionadas ao colaborador selecionado
      const pausasRef = db.collection('pausas');
      pausasRef.add({
        colaboradorId: colaboradorId,
        nomeColaborador: colaboradorSelect.options[colaboradorSelect.selectedIndex].innerText, // Obter o nome do colaborador selecionado no menu suspenso
        diaSemana: diaSemana,
        entrada: entrada,
        pausa1: pausa1,
        refeicao: refeicao,
        pausa2: pausa2,
        saida: saida,
      });

      // Limpar o formulário após o envio
      pausaForm.reset();

      // Atualizar a tabela de pausas após adicionar a pausa
      loadPausas(colaboradorId);
    });
  } else {
    // O usuário não está logado, redirecionar para a página de login
    window.location.href = 'login_adm.html';
  }
});
