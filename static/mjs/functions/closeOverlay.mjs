function closeOverlay(popupId) {

    document.getElementById('divOverlay').style.display = 'none';

    document.getElementById(popupId).style.display = 'none';
    
}

export { closeOverlay };