// Adicione essa função no seu arquivo JavaScript (seu-arquivo-index.js)

// Monitorar o estado de autenticação do usuário (se está logado ou não)
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // O usuário está logado
      // Carregar as informações do usuário na div com id "userInfo"
      const userInfoDiv = document.getElementById('userInfo');
      userInfoDiv.innerHTML = `
        <p>Olá, ${user.displayName}!</p>
        <p> E-mail: ${user.email}</p>
        <p>UID: ${user.uid}</p>
        <p>Role: ${user.role}</p>

        <!-- Aqui você pode exibir outras informações relevantes do usuário -->
      `;
  
      // Carregar os horários de pausas do colaborador logado
      const table = document.querySelector('table');
      const db = firebase.firestore();
      db.collection('horariosDePausas').where('colaboradorId', '==', user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${data.diaSemana}</td>
              <td>${data.tipoPausa}</td>
              <td>${data.horaPausa}</td>
            `;
            table.appendChild(tr);
          });
        })
        .catch((error) => {
          console.error('Erro ao carregar horários de pausas:', error);
        });
    } else {
      // O usuário não está logado, redirecionar para a página de login
      window.location.href = 'login.html';
    }

    
    
  });

 