// seu-arquivo-colaborador.js
const db = firebase.firestore();
auth.onAuthStateChanged((user) => {
  const pausasTable = document.getElementById('pausasTable');
  const nomeColaboradorSpan = document.getElementById('nomeColaborador');

  if (user) {
    // O usuário está logado, verificar se é um colaborador
    // Implemente a lógica para verificar se o usuário é um colaborador

    // Mapeamento de IDs para os nomes dos dias da semana
    const diasSemanaMap = {
      0: 'Domingo',
      1: 'Segunda',
      2: 'Terça',
      3: 'Quarta',
      4: 'Quinta',
      5: 'Sexta',
      6: 'Sábado',
    };

    function loadPausasColaborador(colaboradorId) {
  const pausasRef = db.collection('pausas');
  pausasRef
    .where('colaboradorId', '==', colaboradorId)
    .onSnapshot((snapshot) => {
      pausasTable.innerHTML = ''; // Limpar a tabela antes de atualizar
      const today = new Date().getDay(); // Obter o dia da semana atual (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)

      // Array para armazenar as pausas de cada dia da semana, começando de segunda (índice 0) até domingo (índice 6)
      const pausasPorDia = [[], [], [], [], [], [], []];
      const pausas = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const diaSemanaId = getDiaSemanaId(data.diaSemana);

        // Adicionar a pausa ao array correspondente ao dia da semana
        if (diaSemanaId !== null) {
          pausasPorDia[diaSemanaId].push({  // <-- Erro ocorre nesta linha (39)
            diaSemana: data.diaSemana,
            entrada: data.entrada,
            pausa1: data.pausa1,
            refeicao: data.refeicao,
            pausa2: data.pausa2,
            saida: data.saida,
          });
        }
      });

      // Ordenar as pausas por dia da semana
      const pausasOrdenadas = [];
      for (let i = 1; i <= 7; i++) {
        pausasOrdenadas.push(...pausasPorDia[i % 7]);
      }

      // Exibir as pausas na tabela
      pausasOrdenadas.forEach((pausa) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${pausa.diaSemana}</td>
          <td>${pausa.entrada}</td>
          <td>${pausa.pausa1}</td>
          <td>${pausa.refeicao}</td>
          <td>${pausa.pausa2}</td>
          <td>${pausa.saida}</td>
        `;
        pausasTable.appendChild(tr);
          


        // Destacar o dia atual (today) na tabela
        if (getDiaSemanaId(pausa.diaSemana) === today) {
          tr.classList.add('destacado');
        }
      });
    });
}

    
    // Função para obter o ID do dia da semana com base no nome do dia
    function getDiaSemanaId(nomeDia) {
      const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return diasSemana.indexOf(nomeDia);
    }

    // Carregar informações do colaborador logado
    const colaboradorId = user.uid;
    const colaboradoresRef = db.collection('colaboradores');
    colaboradoresRef
      .doc(colaboradorId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const nomeColaborador = data.name;
          nomeColaboradorSpan.innerText = nomeColaborador;
          // Carregar as pausas específicas do colaborador logado
          loadPausasColaborador(colaboradorId);
        } else {
          // O colaborador não foi encontrado ou não tem permissão
          nomeColaboradorSpan.innerText = 'Colaborador não encontrado';
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar informações do colaborador:', error);
      });
  } else {
    // O usuário não está logado, redirecionar para a página de login
    window.location.href = 'login.html';
  }
});

// Função para efetuar o logout do usuário
function logout() {
  // Verificação de confirmação
  const confirmLogout = confirm("Tem certeza que deseja sair da conta?");
  
  // Se o usuário confirmar o logout, efetua o logout
  if (confirmLogout) {
    firebase.auth().signOut()
      .then(() => {
        alert("Logout efetuado com sucesso!");
        // Redireciona para a página de login após o logout
        window.location.href = "login_colaborador.html";
      })
      .catch((error) => {
        console.error("Erro ao efetuar o logout:", error);
        alert("Ocorreu um erro ao efetuar o logout. Por favor, tente novamente.");
      });
  }
}

// script.js
const popup = document.getElementById('popup');
const dismissButton = document.getElementById('dismiss-btn');

// Função para exibir o pop-up
function exibirPopup() {
    popup.style.display = 'flex';
}

// Função para fechar o pop-up
function fecharPopup() {
    popup.style.display = 'none';
}

// Função para exibir uma notificação do navegador
function exibirNotificacao() {
  if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
              const notificacao = new Notification('Hora da pausa!', {
                  body: 'Aproveite o seu tempo de descanso.',
              });
              
              notificacao.onclick = () => {
                  exibirPopup();
              };
          }
      });
  }
}

// Função para verificar se é hora da pausa
function verificarHoraPausa() {
    const agora = new Date();

    const horaAtual = agora.getHours() + ':' + (agora.getMinutes() < 10 ? '0' : '') + agora.getMinutes();


    const linhasDaTabela = document.querySelectorAll('#pausasTable tr.destacado');

    linhasDaTabela.forEach((linha) => {
        const horarioPausa1 = linha.cells[2].textContent;
        const refeicaoPausa = linha.cells[3].textContent;
        const horarioPausa2 = linha.cells[4].textContent;

        if (horarioPausa1 === horaAtual || refeicaoPausa == horaAtual ||  horarioPausa2 === horaAtual) {
            exibirPopup();
            return;
        }
    });
}

// Verificar a cada 1 minuto
setInterval(verificarHoraPausa, 45000);

dismissButton.addEventListener('click', fecharPopup);
