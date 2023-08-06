// Arquivo login.js

// ... (código de inicialização do Firebase)

// Referências aos elementos do DOM
const emailInput = document.querySelector(".input-mail");
const passwordInput = document.querySelector(".input-pwd");
const form = document.querySelector(".form");
const submitButton = document.querySelector(".submit");
const loader = document.querySelector(".loader");

// Função para realizar o login e exibir o spinner de carregamento
function loginWithEmailAndPassword(email, password) {
  // Exibir o spinner enquanto a autenticação estiver ocorrendo
  submitButton.disabled = true;
  loader.style.display = "inline-block";

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // O usuário fez login com sucesso
      const user = userCredential.user;
      console.log("Usuário logado:", user);

      // Redirecionar para a página de index após o login
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Erro de login:", errorCode, errorMessage);
      // Trate os erros adequadamente
      
      // Remover o spinner e habilitar o botão novamente após a resposta da autenticação
      submitButton.disabled = false;
      loader.style.display = "none";
    });
}

// Função para habilitar/desabilitar o botão de login com base nos campos preenchidos
function toggleLoginButton() {
  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  // Habilitar o botão se ambos os campos estiverem preenchidos
  submitButton.disabled = !(emailValue && passwordValue);
}

// Adicionar eventos de input para verificar a validade dos campos em tempo real
emailInput.addEventListener("input", toggleLoginButton);
passwordInput.addEventListener("input", toggleLoginButton);

// Evento de envio do formulário (login)
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Impede o envio do formulário padrão

  const email = emailInput.value;
  const password = passwordInput.value;

  loginWithEmailAndPassword(email, password);
});

// Arquivo login.js

// Função para redefinir a senha do usuário
function resetPassword() {
  const email = prompt("Insira o e-mail associado à sua conta:");

  if (email) {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        alert("E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.");
      })
      .catch((error) => {
        console.error("Erro ao enviar e-mail de redefinição de senha:", error);
        alert("Ocorreu um erro ao enviar o e-mail de redefinição de senha. Verifique se o e-mail está correto e tente novamente.");
      });
  }
}


// Função para fazer login com o Google
function loginComGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
  
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        // O usuário fez login com sucesso
        const user = result.user;
        console.log("Usuário logado:", user.displayName);
  
        // Redirecionar para a página principal após o login ser concluído
        window.location.href = "index.html";
      })
      .catch((error) => {
        // Tratamento de erro, caso o login falhe
        console.error("Erro no login:", error);
      });
  }
  