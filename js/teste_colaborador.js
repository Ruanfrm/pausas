

const db = firebase.firestore();

// Preencher o seletor com os nomes dos colaboradores
const colaboradorSelect = document.getElementById("colaboradorSelect");

// Consultar os nomes dos colaboradores e preencher o seletor
db.collection("colaboradores").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.id; // ID do documento no Firebase
        option.textContent = doc.data().name; // Nome do colaborador
        colaboradorSelect.appendChild(option);
    });
});

// Evento para quando o colaborador seleciona seu nome
colaboradorSelect.addEventListener("change", function(event) {
    const colaboradorId = event.target.value;

    // Consultar as pausas do colaborador selecionado
    db.collection("pausas").where("colaboradorId", "==", colaboradorId).get().then((querySnapshot) => {
        const pausasTable = document.getElementById("pausasTable");
        pausasTable.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const pausaData = doc.data();

            const row = document.createElement("tr");
            const dataCell = document.createElement("td");
            const horarioCell = document.createElement("td");

            dataCell.textContent = pausaData.data;
            horarioCell.textContent = pausaData.horario;

            row.appendChild(dataCell);
            row.appendChild(horarioCell);
            pausasTable.appendChild(row);
        });
    });
});
