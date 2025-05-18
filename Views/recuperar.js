$(document).ready(function(){
  $("#step_codigo, #step_nueva_pass").hide();

  // Configuro el validate con regla remote para el email
  $("#form_recuperar").validate({
    // 1) Definimos las reglas de validación
    rules: {
      // Paso 1: validar email
      email: {
        required: true,
        email: true,
        remote: {
          url: "../Controllers/RecuperarController.php",
          type: "post",
          data: {
            funcion: "verificar_email",
            value: () => $("#email").val()
          },
          // Esperamos "error" para indicar que el email SÍ está registrado
          dataFilter: resp => resp.trim() === "error"
        }
      },
      // Paso 3: validar nueva contraseña
      nueva_pass: {
        required: true,
        minlength: 5
      },
      // Paso 3: validar que coincida con nueva_pass
      confirm_pass: {
        required: true,
        equalTo: "#nueva_pass"
      }
    },

    // 2) Mensajes personalizados
    messages: {
      email: {
        required: "*Campo obligatorio",
        email: "*Formato inválido",
        remote: "*Correo no registrado"
      },
      nueva_pass: {
        required: "*Campo obligatorio",
        minlength: "*La contraseña debe tener al menos 5 caracteres"
      },
      confirm_pass: {
        required: "*Campo obligatorio",
        equalTo: "*Las contraseñas no coinciden"
      }
    },

    // 3) Dónde insertar el mensaje de error
    errorPlacement: function(error, element) {
      error.addClass("text-danger small mt-1");
      if (element.parent(".input-group").length) {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },

  // 4) Qué hacer cuando el formulario sea "válido" (al enviar email)
  submitHandler: function() {
      // sólo manejamos aquí el envío del código al email;
      // la validación de la nueva contraseña se hace al hacer click en #cambiar_pass
      const email = $("#email").val();
      $.post("../Controllers/RecuperarController.php",
        { funcion: "enviar_codigo", email },
        response => {
          switch (response.trim()) {
            case "enviado":
              toastr.success("Código enviado.");
              $("#step_email").hide();
              $("#step_codigo").show();
              break;
            case "no_existe":
              toastr.error("Este correo no está registrado.");
              break;
            default:
              toastr.error("No se pudo enviar el código.");
          }
        }
      ).fail((jqXHR, textStatus, errorThrown) => {
        console.error("AJAX FAIL:", textStatus, errorThrown);
        toastr.error("Error de conexión.");
      });
    }
  });

  $("#validar_codigo").click(function() {
    const codigo = $("#codigo").val().trim();
    if (!codigo) {
      return toastr.error("Código requerido.");
    }
    $.post("../Controllers/RecuperarController.php",
      { funcion: "validar_codigo", codigo },
      resp => {
        if (resp.trim() === "valido") {
          $("#step_codigo").hide();
          $("#step_nueva_pass").show();
        } else {
          toastr.error("Código incorrecto.");
        }
      }
    );
  });

  $("#cambiar_pass").click(function() {
    if (!$("#form_recuperar").valid()) {
      return;
    }

    const nueva = $("#nueva_pass").val().trim();
    const confirm = $("#confirm_pass").val().trim();

    $.post("../Controllers/RecuperarController.php", {
        funcion: "cambiar_pass",
        nueva_pass: nueva
      },
      resp => {
        switch (resp.trim()) {
          case "success":
            toastr.options = {
              "onHidden": function() {
                window.location = "login.php";
              },
              "timeOut": 1500
            };
            toastr.success("Contraseña cambiada.");
            break;
          case "same":
            toastr.error("La nueva contraseña no puede ser la misma que la anterior.");
            break;
          default:
            toastr.error("No se pudo cambiar la contraseña.");
        }
      }
    ).fail(() => {
      toastr.error("No se pudo conectar al servidor.");
    });
  });

});
