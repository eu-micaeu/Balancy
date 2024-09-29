function btCreate(){

    document.getElementById("btCreate").addEventListener("click", function () {

        var divOverlay = document.getElementById("divOverlay");
    
        divOverlay.style.display = "block";
    
        var popUpCreateMenu = document.getElementById("popUpCreateMenu");
    
        popUpCreateMenu.style.display = "flex";
    
    });

}

export { btCreate };