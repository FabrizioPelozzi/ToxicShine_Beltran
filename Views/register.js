$(document).ready(function() {
    var funcion;
    verificar_sesion();

    // Verificar si el usuario ha iniciado sesión
    function verificar_sesion() {
        funcion = "verificar_sesion";
        $.post("../Controllers/UsuarioController.php", {funcion}, (response) => {
            if (response != "") {
                location.href = "Index.php";
            }
        });
    }

    // Configuración de la validación del formulario
    $.validator.setDefaults({
        submitHandler: function () {
            let email = $("#email").val();
            let pass = $("#pass").val();
            let nombres = $("#nombres").val();
            let apellidos = $("#apellidos").val();
            let dni = $("#dni").val();
            let telefono = $("#telefono").val();
            let estado = "activo";
            funcion = "registrar_usuario";
            $.post("../Controllers/UsuarioController.php", 
                {email, pass, nombres, apellidos, dni, telefono, estado, funcion}, 
                (response) => {
                    response = response.trim();
                    //console.log(response);
                    if (response === "success") {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Se ha registrado correctamente",
                            showConfirmButton: false,
                            timer: 2500
                        }).then(function(){
                            $("#form-register").trigger("reset");
                            location.href = "../Views/login.php";
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo conflicto con el registro, comuníquese con el área de sistemas",
                        });
                    }
                }
            );
        }
    });

    // Valida que el email no exista
    jQuery.validator.addMethod("usuario_existente",
        function(value, element) {
            let funcion = "verificar_email";
            let bandera;
            $.ajax({
                type: "POST",
                url: "../Controllers/UsuarioController.php",
                data: {funcion, value},
                async: false,
                success: function (response) {
                    bandera = response !== "success";
                }
            });
            return bandera;
        },
        "*Este usuario ya está registrado, ingrese un email diferente"
    );

    // Valida que el DNI no exista
    jQuery.validator.addMethod("dni_existente",
    function(value, element) {
        let funcion = "verificar_dni";
        let existe;
        $.ajax({
            type: "POST",
            url: "../Controllers/UsuarioController.php",
            data: { funcion, value },
            async: false,
            success: function (response) {
                existe = (response.trim() !== "success");
            }
        });
        return existe;
    },
    "*Este DNI ya está registrado, ingrese un DNI diferente"
    );

    // Valida que el campo solo contenga letras
    jQuery.validator.addMethod("letras",
        function(value, element) {
            return /^[A-Za-z\s]+$/.test(value);
        },
        "*Este campo solo permite letras"
    );

    // Validación del formulario
    $('#form-register').validate({
        rules: {
            nombres: {
                required: true,
                letras: true
            },
            apellidos: {
                required: true,
                letras: true
            },
            email: {
                required: true,
                email: true,
                usuario_existente: true
            },
            pass: {
                required: true,
                minlength: 5,
                maxlength: 20
            },
            dni: {
                required: true,
                digits: true,
                minlength: 8,
                maxlength: 8,
                dni_existente: true
            },
            telefono: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            pass_repeat: {
                required: true,
                equalTo: "#pass"
            },
            terms: {
                required: true
            }
        },
        messages: {
            pass: {
                required: "Ingrese una contraseña",
                minlength: "Tu contraseña debe ser de mínimo 5 caracteres",
                maxlength: "Tu contraseña debe ser de máximo 20 caracteres"
            },
            pass_repeat: {
                required: "Ingrese una contraseña",
                equalTo: "Las contraseñas ingresadas deben coincidir"
            },
            nombres: {
                required: "Ingrese un nombre",
            },
            apellidos: {
                required: "Ingrese un apellido",
            },
            dni: {
                required: "Ingrese un DNI",
                minlength: "Tu DNI debe ser de 8 caracteres",
                maxlength: "Tu DNI debe ser de 8 caracteres",
                digits:    "El DNI solo está compuesto por números",
                dni_existente: "Este DNI ya está registrado, ingrese otro"
            },
            email: {
                required: "Ingrese un correo electrónico",
                email: "Ingrese un correo electrónico válido"
            },
            telefono: {
                required: "Ingrese un N° de teléfono",
                minlength: "Tu N° de teléfono debe ser de 10 caracteres",
                maxlength: "Tu N° de teléfono debe ser de 10 caracteres",
                digits: "El teléfono solo debe contener números"
            },
            terms: "Por favor, acepte los términos de servicio"
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
            $(element).removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
            $(element).addClass('is-valid');
        }
    });
});
