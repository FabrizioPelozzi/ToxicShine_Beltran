$(document).ready(function() {
    Loader();
    //setTimeout(verificar_sesion,1000);
    verificar_sesion();

    //Cargar Pagina
    async function verificar_sesion() {
        funcion = "verificar_sesion";
        let data = await fetch("../Controllers/UsuarioController.php",{
            method:"POST",
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body: "funcion=" +funcion

        })
        if (data.ok) {
            let response = await data.text();
            //console.log(response);
            
            try {
                if (response !="") {
                    let sesion =JSON.parse(response);
                    ////console.log(sesion);
                    llenar_menu_superior(sesion);
                    llenar_menu_lateral(sesion);
                    $("#active_nav_soporte").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_carrito();
                    read_favoritos();
                }
                else{
                    llenar_menu_superior();
                    llenar_menu_lateral();
                }
                CloseLoader();

            } catch (error) {
                //console.error(error);
                //console.log(response);
            }
            
        }else{
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de codigo: " + data.status,
            })
        }
    }

    $(function(){
      // Validación
      $('#form-soporte').validate({
        rules: {
          email: {
            required: true,
            email: true
          },
          telefono: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 15
          },
          nombre: {
            required: true,
            letters: true
          },
          apellido: {
            required: true,
            letters: true
          },
          dni: {
            required: true,
            digits: true,
            minlength: 8,
            maxlength: 8
          },
          tipo: { required: true },
          descripcion: {
            required: true,
            minlength: 10
          }
        },
        messages: {
          email: { required: 'Ingresa tu email', email: 'Email inválido' },
          telefono: {
            required: 'Ingresa tu teléfono',
            digits: 'Sólo números',
            minlength: 'Mínimo 10 dígitos',
            maxlength: 'Máximo 15 dígitos'
          },
          nombre: { required: 'Ingresa tu nombre' },
          apellido: { required: 'Ingresa tu apellido' },
          dni: {
            required: 'Ingresa tu DNI',
            digits: 'Sólo números',
            minlength: '8 dígitos',
            maxlength: '8 dígitos'
          },
          tipo: { required: 'Selecciona un tipo de incidencia' },
          descripcion: {
            required: 'Describe tu problema',
            minlength: 'Describe un poco más (mínimo 10 caracteres)'
          }
        },
        errorClass: 'is-invalid',
        validClass: 'is-valid',
        errorElement: 'div',
        errorPlacement: function(error, element){
          error.addClass('invalid-feedback');
          if (element.parent('.input-group').length) {
            error.insertAfter(element.parent());
          } else {
            error.insertAfter(element);
          }
        },
        highlight: function(el){ $(el).addClass('is-invalid').removeClass('is-valid'); },
        unhighlight: function(el){ $(el).removeClass('is-invalid').addClass('is-valid'); },
        submitHandler: function(form){
          const data = $(form).serialize() + '&funcion=enviar_soporte';
          $.post('../Controllers/SoporteController.php', data, function(res){
            if (res.trim()==='success') {
              Swal.fire({
                icon: 'success',
                title: '¡Enviado!',
                text: 'Tu solicitud de soporte ha sido recibida'
              });
              form.reset();
              $('.is-valid').removeClass('is-valid');
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al enviar. Intenta de nuevo.'
              });
            }
          });
        }
      });
  
      // Método sólo letras
      jQuery.validator.addMethod('letters', function(v,e){
        return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(v);
      }, 'Sólo letras');
    });
});