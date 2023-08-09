// script.js
function updateTime() {
    const now = new Date();
    const options = { timeZone: 'America/Sao_Paulo', hour12: false };
    const timeString = now.toLocaleTimeString('pt-BR', options);
    const dateString = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}

setInterval(updateTime, 1000); // Atualizar a cada 1 segundo
updateTime(); // Atualizar imediatamente ao carregar a página
