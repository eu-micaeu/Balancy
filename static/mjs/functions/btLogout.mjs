function btLogout() {

    document.getElementById('btLogout').addEventListener('click', function () {

        window.location.href = '/';
    
        // Deletar cookie
        document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    });

}

export { btLogout };