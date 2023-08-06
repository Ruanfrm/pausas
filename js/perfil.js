function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
  
    // Verifica se o usuário selecionou uma imagem
    if (!file) {
      alert("Selecione uma imagem!");
      return;
    }
  
    // Referência para o storage do Firebase onde a imagem será armazenada
    const storageRef = firebase.storage().ref();
  
    // Caminho do arquivo no storage (neste exemplo, utiliza o UID do usuário como nome do arquivo)
    const user = firebase.auth().currentUser;
    const filePath = `perfil/${user.uid}/${file.name}`;
  
    // Faz o upload da imagem para o storage
    const uploadTask = storageRef.child(filePath).put(file);
  
    // Monitora o progresso do upload (opcional)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload: ${progress}% concluído`);
      },
      (error) => {
        console.error("Erro ao fazer upload da imagem:", error);
      },
      () => {
        // Se o upload for concluído com sucesso, obtém a URL da imagem
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          // Aqui você pode armazenar a URL da imagem no banco de dados do usuário, se necessário
          console.log("URL da imagem:", downloadURL);
          alert("Foto do perfil adicionada com sucesso!");
  
          // Armazena a URL da imagem no localStorage
          localStorage.setItem("userImageURL", downloadURL);
  
          // Atualiza o elemento <img> na navbar com a URL da imagem do perfil
          const userImage = document.getElementById("userImage");
          userImage.src = downloadURL;
        });
      }
    );
  }
  
  function loadUserProfile() {
    // Recupera a URL da imagem armazenada no localStorage
    const userImageURL = localStorage.getItem("userImageURL");
  
    // Se a URL existir, atualiza o elemento <img> na navbar com a URL da imagem do perfil
    if (userImageURL) {
      const userImage = document.getElementById("userImage");
      userImage.src = userImageURL;
    }
  }
  
  // Chama a função para carregar o perfil do usuário ao carregar a página
  document.addEventListener("DOMContentLoaded", loadUserProfile);
  

  function openModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
  }
  
  function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
  }
  
  window.onclick = function(event) {
    var modal = document.getElementById("modal");
    if (event.target === modal) {
      closeModal();
    }
  }

  function checkFile() {
    const fileInput = document.getElementById("fileInput");
    const confirmButton = document.getElementById("confirmButton");
  
    if (fileInput.files.length > 0) {
      confirmButton.style.display = "block";
    } else {
      confirmButton.style.display = "none";
    }
  }
  
  // Restante do código mantido igual
  

  // Função para fazer logout (sair da conta)
function signOut() {
    firebase.auth().signOut()
      .then(() => {
        // Logout bem-sucedido
        console.log('Usuário deslogado');
        closeModal();
      })
      .catch((error) => {
        // Ocorreu um erro no logout
        console.error('Erro ao deslogar:', error);
      });
  }
  
  // Função para mudar a senha do usuário
  function changePassword() {
    const newPassword = document.getElementById("newPassword").value;
  
    const user = firebase.auth().currentUser;
  
    user.updatePassword(newPassword)
      .then(() => {
        // Senha atualizada com sucesso
        alert('Senha alterada com sucesso');
        closeModal();
      })
      .catch((error) => {
        // Ocorreu um erro na atualização da senha
        alert('Erro ao mudar a senha:', error);
      });
  }
  