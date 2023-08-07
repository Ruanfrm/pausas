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
              <td>
                <button class="edit-btn" data-bs-toggle="tooltip"   title="Editar" ><i class="fas fa-edit" data-id="${doc.id}" ></i></button> 
                <button class="delete-btn" data-bs-toggle="tooltip" title="Excluir" ><i class="fas fa-trash" data-id="${doc.id}"></i></button>
              </td>
            `;
            pausasTable.appendChild(tr);
          });

          // Adicionar eventos de clique para os botões de edição e exclusão
          const editBtns = document.querySelectorAll('.edit-btn');
          const deleteBtns = document.querySelectorAll('.delete-btn');

          editBtns.forEach((btn) => {
            btn.addEventListener('click', handleEditPausa);
          });

          deleteBtns.forEach((btn) => {
            btn.addEventListener('click', handleDeletePausa);
          });
        });

              
        // Inicializar os tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
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

// ...

// Função para abrir o modal de edição de pausa
function handleEditPausa(event) {
  const pausaId = event.target.getAttribute('data-id');
  console.log(pausaId)

  const pausaRef = db.collection('pausas').doc(pausaId);
  pausaRef.get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        // Preencher os campos do formulário com os dados da pausa atual
        document.getElementById('editPausaDiaSemana').value = data.diaSemana;
        document.getElementById('editPausaEntrada').value = data.entrada;
        document.getElementById('editPausaPausa1').value = data.pausa1;
        document.getElementById('editPausaRefeicao').value = data.refeicao;
        document.getElementById('editPausaPausa2').value = data.pausa2;
        document.getElementById('editPausaSaida').value = data.saida;

        // Abrir o modal de edição
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();

        // Evento para salvar a pausa editada quando o formulário for enviado
        document.getElementById('editPausaForm').addEventListener('submit', function (event) {
          event.preventDefault();

          const editedPausa = {
            diaSemana: document.getElementById('editPausaDiaSemana').value,
            entrada: document.getElementById('editPausaEntrada').value,
            pausa1: document.getElementById('editPausaPausa1').value,
            refeicao: document.getElementById('editPausaRefeicao').value,
            pausa2: document.getElementById('editPausaPausa2').value,
            saida: document.getElementById('editPausaSaida').value,
          };

          // Atualizar a pausa no Firestore
          pausaRef.update(editedPausa)
          .then(() => {
            console.log("Pausa atualizada com sucesso!");
            editModal.hide(); // Fechar o modal de edição após a atualização
            // Atualizar a tabela de pausas após a edição
            // loadPausas(data.colaboradorId);
          })
            .catch((error) => {
              console.error("Erro ao atualizar pausa: ", error);
            });
        });
      } else {
        console.log("Documento não encontrado!");
      }
    })
    .catch((error) => {
      console.error("Erro ao obter a pausa: ", error);
    });
}

// Função para abrir o modal de confirmação de exclusão de pausa
function handleDeletePausa(event) {
  const pausaId = event.target.getAttribute('data-id');
  const pausaRef = db.collection('pausas').doc(pausaId);

  // Abrir o modal de exclusão
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  deleteModal.show();

  // Evento para confirmar a exclusão quando o botão "Confirmar" for clicado
  document.getElementById('deleteConfirmBtn').addEventListener('click', function () {
    // Apagar a pausa no Firestore
    pausaRef.delete()
      .then(() => {
        console.log("Pausa apagada com sucesso!");
        deleteModal.hide(); // Fechar o modal de exclusão após a exclusão
        // Atualizar a tabela de pausas após a exclusão
        // loadPausas();
      })
      .catch((error) => {
        console.error("Erro ao apagar pausa: ", error);
      });
  });
}
