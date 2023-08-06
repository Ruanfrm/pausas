

// Função para criar a conta do usuário e redirecionar para a página de index
function createUserWithEmailAndPassword(name, email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // O usuário foi criado com sucesso
      const user = userCredential.user;
      console.log("Usuário criado:", user);

      // Definir o displayName do usuário recém-criado
      return user.updateProfile({
        displayName: name
      });
    })
    .then(() => {
      // Redirecionar para a página de index após o cadastro bem-sucedido
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Erro de cadastro:", errorCode, errorMessage);
      // Trate os erros adequadamente
    });
}

// Resto do código permanece o mesmo...

  
  // Função para habilitar/desabilitar o botão de cadastro com base nos campos preenchidos
  function toggleCadastroButton() {
    const nameValue = document.getElementById("input-name").value.trim();
    const emailValue = document.getElementById("input-email").value.trim();
    const passwordValue = document.getElementById("input-pwd").value.trim();
  
    // Habilitar o botão se todos os campos estiverem preenchidos
    document.getElementById("submit-button").disabled = !(nameValue && emailValue && passwordValue);
  }
  
  // Adicionar eventos de input para verificar a validade dos campos em tempo real
  document.getElementById("input-name").addEventListener("input", toggleCadastroButton);
  document.getElementById("input-email").addEventListener("input", toggleCadastroButton);
  document.getElementById("input-pwd").addEventListener("input", toggleCadastroButton);
  
  // Evento de envio do formulário (cadastro)
  document.getElementById("cadastro-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o envio do formulário padrão
  
    const name = document.getElementById("input-name").value;
    const email = document.getElementById("input-email").value;
    const password = document.getElementById("input-pwd").value;
  
    createUserWithEmailAndPassword(name, email, password);
  });
  
  