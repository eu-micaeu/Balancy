function divOverlay(){

    document.getElementById("divOverlay").addEventListener("click", function () {

        var divOverlay = document.getElementById("divOverlay");
    
        divOverlay.style.display = "none";
    
        var popUpCreate = document.getElementById("popUpCreate");
    
        popUpCreate.style.display = "none";
    
    });

}

export { divOverlay };