function btCreate(){

    document.getElementById("btCreate").addEventListener("click", function () {

        var divOverlay = document.getElementById("divOverlay");
    
        divOverlay.style.display = "block";
    
        var popUpCreate = document.getElementById("popUpCreate");
    
        popUpCreate.style.display = "flex";
    
    });

}

export { btCreate };