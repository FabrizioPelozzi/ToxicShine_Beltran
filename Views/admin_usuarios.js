$(document).ready(function(){
    Loader();
    //setTimeout(verificar_sesion,1000);
    verificar_sesion();

    let allUsuarios = [];

    // Cargar Pagina
    async function verificar_sesion() {
        funcion = "verificar_sesion";
        let data = await fetch("../Controllers/UsuarioController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "funcion=" + funcion
        });
    
        if (data.ok) {
            let response = await data.text();
            try {
                if (response != "") {
                    let sesion = JSON.parse(response);
    
                    // Validación de tipo de usuario
                    if (sesion.id_tipo_usuario != 1 && sesion.id_tipo_usuario != 3) {
                        Swal.fire({
                            icon: "error",
                            title: "Acceso denegado",
                            text: "No tienes permiso para acceder a esta sección."
                        }).then(() => {
                            window.location.href = "index.php";
                        });
                        return;
                    }
    
                    llenar_menu_superior(sesion);
                    llenar_menu_lateral(sesion);
                    $("#active_nav_usuarios").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito();
                    read_all_usuarios_por_dni('');
                    
                } else {
                    // Si no hay sesión, redirigir al login
                    Swal.fire({
                        icon: "info",
                        title: "Sesión no iniciada",
                        text: "Por favor inicia sesión para acceder.",
                    }).then(() => {
                        window.location.href = "login.php";
                    });
                }
    
                CloseLoader();
            } catch (error) {
                console.error("Error en verificar_sesion:", error);
            }
    
        } else {
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de código: " + data.status,
            });
        }
    }

    // Búsqueda en tiempo real por DNI
    $('#dni_busqueda').on('input', function(){
      const filtro = $(this).val().trim();
      read_all_usuarios_por_dni(filtro);
    });

    // Leer todos los usuarios con filtro
    async function read_all_usuarios_por_dni(dni) {
      try {
        const params = new URLSearchParams({
          funcion: 'leer_usuarios',
          dni: dni
        });
        const res = await fetch('../Controllers/UsuarioController.php', {
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: params.toString()
        });
        const text = await res.text();
        const usuarios = JSON.parse(text || '[]');
        allUsuarios = usuarios;
        read_all_usuarios(usuarios);
      } catch (e) {
        console.error('Error leyendo usuarios:', e);
        $('#usuario_list').html('<p class="text-danger">Error al cargar usuarios.</p>');
      }
    }

    // Leer todos los usuarios
    function read_all_usuarios(lista) {
      const $c = $('#usuario_list');
      $c.empty();
      if (!lista.length) {
        return $c.html('<p>No se encontraron usuarios.</p>');
      }
      let tpl = '';
      lista.forEach(u => {
        tpl += `
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
              <div class="card-header bg-secondary text-white">
                ID: ${u.id_usuario}
                <span class="badge bg-light text-dark ms-2">${u.tipo_usuario}</span>
              </div>
              <div class="card-body">
                <p><strong>DNI:</strong> ${u.dni}</p>
                <p><strong>Nombre:</strong> ${u.nombre} ${u.apellido}</p>
                <p><strong>Email:</strong> ${u.email}</p>
                <p><strong>Tel:</strong> ${u.telefono}</p>
              </div>
              <div class="card-footer text-end">
                <button class="edit-user btn btn-info btn-sm me-2" data-id="${u.id_usuario}">
                  <i class="fas fa-pencil-alt"></i> Editar
                </button>
                <button class="delete-user btn btn-danger btn-sm" data-id="${u.id_usuario}">
                  <i class="fas fa-trash-alt"></i> Eliminar
                </button>
              </div>
            </div>
          </div>`;
      });
      $c.html(tpl);
    }

    // Modal de edición
    $(document).on('click', '.edit-user', function(){
      const id = $(this).data('id');
      const u  = allUsuarios.find(x => x.id_usuario === id);
      if (!u) return;

      $('#id_usuario_mod').val(u.id_usuario);
      $('#email_mod').val(u.email).removeClass('is-valid is-invalid');
      $('#dni_mod').val(u.dni).removeClass('is-valid is-invalid');
      $('#form-edit-user').validate().resetForm();
      $('#modal_edit_user').modal('show');
    });
    
    // Email único
    jQuery.validator.addMethod("email_unico_admin",
      function(value, element) {
        let valido = false;
        $.ajax({
          type: "POST",
          url: "../Controllers/UsuarioController.php",
          data: {
            funcion: "verificar_email",
            value: value,                // debe coincidir con $_POST['value']
            // no necesitas enviar id_usuario, porque verificar_email solo comprueba existencia global
          },
          async: false,
          success: function(response) {
            // response == "success" si YA existe, queremos invalidar
            valido = response.trim() !== "success";
          }
        });
        return valido;
      },
  "*Este email ya está en uso"
    );

    // DNI único
    jQuery.validator.addMethod("dni_unico_admin",
      function(value, element) {
        let valido = false;
        $.ajax({
          type: "POST",
          url: "../Controllers/UsuarioController.php",
          data: {
            funcion: "verificar_dni",
            value: value
          },
          async: false,
          success: function(response) {
            valido = response.trim() !== "success";
          }
        });
        return valido;
      },
      "*Este DNI ya está en uso"
    );

    // Validación del formulario
    $('#form-edit-user').validate({
      rules: {
        email_mod: {
          required: true,
          email: true,
          email_unico_admin: true    // antes era usuario_existente
        },
        dni_mod: {
          required: true,
          digits: true,
          minlength: 8,
          maxlength: 8,
          dni_unico_admin: true      // antes era dni_existente
        }
      },
      messages: {
        email_mod: {
          required: "Ingrese un correo electrónico",
          email:    "Ingrese un correo válido",
          email_unico_admin: "Este email ya está en uso"
        },
        dni_mod: {
          required: "Ingrese un DNI",
          digits:   "Sólo números",
          minlength:"8 dígitos",
          maxlength:"8 dígitos",
          dni_unico_admin: "Este DNI ya está en uso"
        }
      },
      errorElement: 'span',
      errorPlacement: function(error, element) {
        error.addClass('invalid-feedback');
        element.closest('.mb-3').append(error);
      },
      highlight: function(element) {
        $(element).addClass('is-invalid').removeClass('is-valid');
      },
      unhighlight: function(element) {
        $(element).removeClass('is-invalid').addClass('is-valid');
      },
      submitHandler: function(form) {
        // AJAX para editar email y dni
        const data = $(form).serialize() + '&funcion=editar_usuario_admin';
        $.post('../Controllers/UsuarioController.php', data, function(res) {
          if (res.trim() === 'success') {
            Swal.fire('Éxito','Datos actualizados','success');
            $('#modal_edit_user').modal('hide');
            read_all_usuarios_por_dni($('#dni_busqueda').val().trim());
          } else {
            Swal.fire('Error','No se pudo actualizar','error');
          }
        });
      }
    });
});