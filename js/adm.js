// Adicione essa função no seu arquivo JavaScript (seu-arquivo-adm.js)

// Carregar a lista de usuários cadastrados
function carregarUsuarios() {
    const table = document.querySelector('table');
    const db = firebase.firestore();
    db.collection('usuarios')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${data.email}</td>
            <td>${data.role}</td>
            <td><button onclick="editarUsuario('${doc.id}')">Editar</button></td>
          `;
          table.appendChild(tr);
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar a lista de usuários:', error);
      });
  }
  
  // Carregar a lista de colaboradores para o campo select
  function carregarColaboradoresSelect() {
    const select = document.getElementById('colaborador');
    const db = firebase.firestore();
    db.collection('usuarios').where('role', '==', 'colaborador')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const option = document.createElement('option');
          option.value = doc.id;
          option.textContent = data.email;
          select.appendChild(option);
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar os colaboradores:', error);
      });
  }
  
  // Adicionar pausa para um colaborador selecionado
  function adicionarPausa() {
    const colaboradorId = document.getElementById('colaborador').value;
    const tipoPausa = document.getElementById('tipoPausa').value;
    const horaPausa
  