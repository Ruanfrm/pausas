// Arquivo profile.js

// Função para carregar as informações do perfil do usuário
function loadUserProfile() {
    const user = firebase.auth().currentUser;
  
    if (user) {
      const inputName = document.getElementById("inputName");
      const inputEmail = document.getElementById("inputEmail");
  
      inputName.value = user.displayName || "";
    //   inputEmail.value = user.email || "";
    } else {
      // Redireciona para a página de login caso o usuário não esteja autenticado
      window.location.href = "login.html";
    }
  }
  
  // Função para salvar as informações do perfil do usuário
  function saveProfile() {
    const user = firebase.auth().currentUser;
  
    if (user) {
      const inputName = document.getElementById("inputName").value;
    //   const inputEmail = document.getElementById("inputEmail").value;
  
      // Atualiza as informações do perfil do usuário no Firebase
      user.updateProfile({
        displayName: inputName
      }).then(() => {
        alert("Perfil atualizado com sucesso!");
        
        window.location;href = "index.html"
      }).catch((error) => {
        console.error("Erro ao atualizar o perfil:", error);
        alert("Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.");
      });
    }
  }
  