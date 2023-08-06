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
        window.location.href = "login_adm.html";
      })
      .catch((error) => {
        console.error("Erro ao efetuar o logout:", error);
        alert("Ocorreu um erro ao efetuar o logout. Por favor, tente novamente.");
      });
  }
}
