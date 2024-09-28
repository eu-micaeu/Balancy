// Funções para abrir e fechar overlays
function openOverlay(popupId) {
    document.getElementById('divOverlay').style.display = 'block';
    document.getElementById(popupId).style.display = 'block';
}

export { openOverlay };