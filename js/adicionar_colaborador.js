const db = firebase.firestore();
const addCollaboratorForm = document.getElementById('addCollaboratorForm');
const collaboratorNameInput = document.getElementById('collaboratorName');
const collaboratorEmailInput = document.getElementById('collaboratorEmail');
const collaboratorPasswordInput = document.getElementById('collaboratorPassword');
const successMessage = document.getElementById('successMessage');

addCollaboratorForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Resetar mensagens de sucesso e erro
  successMessage.textContent = '';
  collaboratorNameError.textContent = '';
  collaboratorEmailError.textContent = '';
  collaboratorPasswordError.textContent = '';

  const collaboratorName = collaboratorNameInput.value;
  const collaboratorEmail = collaboratorEmailInput.value;
  const collaboratorPassword = collaboratorPasswordInput.value;

  // Validar campos de nome, e-mail e senha
  if (!collaboratorName) {
    collaboratorNameError.textContent = 'Digite o nome do colaborador.';
    return;
  }

  if (!collaboratorEmail) {
    collaboratorEmailError.textContent = 'Digite o e-mail do colaborador.';
    return;
  }

  if (!collaboratorPassword) {
    collaboratorPasswordError.textContent = 'Digite a senha do colaborador.';
    return;
  }

  // Criar o colaborador com e-mail/senha
  firebase.auth().createUserWithEmailAndPassword(collaboratorEmail, collaboratorPassword)
    .then((userCredential) => {
      // Adicionar informações adicionais do colaborador ao Firestore
      return db.collection("colaboradores").doc(userCredential.user.uid).set({
        name: collaboratorName,
        email: collaboratorEmail
      });
    })
    .then(() => {
      console.log("Colaborador adicionado com sucesso.");
      // Limpar o formulário após adicionar o colaborador
      addCollaboratorForm.reset();
      // Exibir mensagem de sucesso
      successMessage.textContent = 'Colaborador adicionado com sucesso.';
    })
    .catch((error) => {
      console.error("Erro ao adicionar colaborador: ", error);
    });
});
