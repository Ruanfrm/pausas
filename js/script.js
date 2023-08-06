// Arquivo index.js

// Arquivo index.js

// Função para atualizar as informações do usuário na navbar
function updateUserInfo(user) {
  const userNameElement = document.getElementById("user-name");
  const userEmailElement = document.getElementById("user-email");

  if (user) {
    // O usuário está logado, atualizar as informações
    userNameElement.textContent = user.displayName || "Nome do Usuário Bugado";
    userEmailElement.textContent = user.email || "user@example.com";
  } else {
    // Caso o usuário não esteja logado, restaurar os valores padrão
    userNameElement.textContent = "Nome do Usuário";
    userEmailElement.textContent = "user@example.com";
  }
}



// Função para redirecionar para a tela de login
function redirectToLogin() {
  window.location.href = "login.html";
}

// Função para verificar o status de autenticação do usuário
function checkUserAuth() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // O usuário está logado
      // showUserInfo(user);
      updateUserInfo(user);
    } else {
      // O usuário não está logado, redirecionar para a tela de login
      redirectToLogin();
    }
  });
}


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
        window.location.href = "login.html";
      })
      .catch((error) => {
        console.error("Erro ao efetuar o logout:", error);
        alert("Ocorreu um erro ao efetuar o logout. Por favor, tente novamente.");
      });
  }
}


// Função para alterar a senha do usuário
function changePassword() {
  const user = firebase.auth().currentUser;
  
  if (user) {
    // Exibe um prompt para o usuário inserir a nova senha
    const newPassword = prompt("Insira a nova senha:");
    
    if (newPassword) {
      // Altera a senha do usuário no Firebase Auth
      user.updatePassword(newPassword)
        .then(() => {
          alert("Senha alterada com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao alterar a senha:", error);
          alert("Ocorreu um erro ao alterar a senha. Por favor, tente novamente mais tarde.");
        });
    }
  } else {
    // Caso o usuário não esteja logado, redirecionar para a tela de login
    redirectToLogin();
  }
}


// Verificar o status de autenticação ao carregar a página
checkUserAuth();
