$(document).ready(function() {
    var funcion;
    verificar_sesion();

    function verificar_sesion() {
        funcion = "verificar_sesion";
        $.post("../Controllers/UsuarioController.php", { funcion }, (response) => {
            if (response != "") {
                location.href = "../Index.php";
            }
        });
    }

    $("#form-login").submit(e => { 

        funcion = "login";
        let user = $("#user").val();
        let pass = $("#pass").val();
        
        $.post("../Controllers/UsuarioController.php", { user, pass, funcion }, (response) => {

            if (response == "logueado") {
                toastr.success("Logueado!");
                console.log(response);
                location.href = "Index.php";
            } else {
                toastr.error("Usuario o contraseña incorrectos");
                console.log(response);
            }
        });
        e.preventDefault();
    });
});
