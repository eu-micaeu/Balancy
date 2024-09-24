import { getCookie } from './getCookie.mjs';

function btCreateMenuConfirm(){

    document.getElementById('btCreateMenuConfirm').addEventListener('click', function () {

        var menuName = document.getElementById('menuName').value;
    
        fetch('/createMenu', {
    
            method: 'POST',
    
            headers: {
    
                'Content-Type': 'application/json',
    
                'Authorization': getCookie()
    
            },
    
            body: JSON.stringify({ 

                menu_name: menuName 

            })
    
        }).then(response => {
    
            if (response.ok) {
    
                document.getElementById('divOverlay').click();
    
            }
    
        });
    
    
    });

}

export { btCreateMenuConfirm };