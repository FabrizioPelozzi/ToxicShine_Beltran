$(document).ready(function(){
  $("#step_codigo, #step_nueva_pass").hide();

  // Configuro el validate con regla remote para el email
  $("#form_recuperar").validate({
    rules: {
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
          dataFilter: resp => resp.trim() === "error"
        }
      }
    },
    messages: {
      email: {
        required: "*Campo obligatorio",
        email: "*Formato inválido",
        remote: "*Correo no registrado"
      }
    },
    errorPlacement: function(error, element) {
      error.addClass("text-danger small mt-1");
      if (element.parent(".input-group").length) {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function() {
      const email = $("#email").val();
      // Aquí va la petición POST para enviar código
      $.post("../Controllers/RecuperarController.php",
        { funcion: "enviar_codigo", email },
        function(response) {
          // DEBUG: imprime respuesta cruda y trimmed en consola
        //   console.log("RESP RAW:", response);
        //   console.log("RESP TRIM:", response.trim());

          // Lógica original de manejo de respuesta
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
      const nueva = $("#nueva_pass").val().trim();
      if (nueva.length < 5) {
        return toastr.error("La contraseña debe tener al menos 5 caracteres.");
      }
      $.post("../Controllers/RecuperarController.php",
        { funcion: "cambiar_pass", nueva_pass: nueva },
        resp => {
          if (resp.trim() === "success") {
            toastr.options = {
              "onHidden": function() {
                window.location = "login.php";
              },
              "timeOut": 1500
            };
            toastr.success("Contraseña cambiada.");
          } else {
            toastr.error("No se pudo cambiar la contraseña.");
          }
        }
      ).fail(() => {
        toastr.error("No se pudo conectar al servidor.");
      });
    });

});
