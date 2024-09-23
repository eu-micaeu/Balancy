function btBack() {

    document.getElementById("btBack").addEventListener("click", function() {

        window.history.back();

    });

}

export { btBack };