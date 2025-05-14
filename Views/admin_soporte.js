$(document).ready(function(){
    Loader();
    //setTimeout(verificar_sesion,1000);
    verificar_sesion();

    let allPeticiones = [];

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
                    $("#active_nav_admin_soporte").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito();
                    cargarTickets();
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
     
    // Re-filtro
    $('#filtro_estado, #filtro_tipo').on('change', () => {
      cargarTickets($('#filtro_estado').val(), $('#filtro_tipo').val());
    });

    $('#btn_refrescar').on('click', () => {
      cargarTickets($('#filtro_estado').val(), $('#filtro_tipo').val());
    });

    async function cargarTickets(estado = '', tipo = '') {
      const params = new URLSearchParams({ funcion: 'leer_tickets' });
      if (estado) params.append('filtro_estado', estado);
      if (tipo)   params.append('filtro_tipo', tipo);
      const res = await fetch('../Controllers/SoporteController.php', {
        method: 'POST',
        body: params
      });
      allPeticiones = await res.json();
      renderTickets(allPeticiones);
    }

    function renderTickets(lista) {
      const $c = $('#soporte_list');
      $c.empty();

      if (!lista.length) {
        return $c.html('<p class="text-center text-muted">No hay peticiones de soporte.</p>');
      }

      let tpl = '';
      lista.forEach(t => {
        let headerClass;

        switch (t.estado) {
          case 'pendiente':
            headerClass = 'bg-warning text-dark';
            break;
          case 'en_proceso':
            headerClass = 'bg-info text-white';
            break;
          case 'resuelto':
            headerClass = 'bg-success text-white';
            break;
          case 'cerrado':
            headerClass = 'bg-secondary text-white';
            break;
          default:
            headerClass = 'bg-light text-dark';
        }

        tpl += `
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
              <div class="card-header ${headerClass} d-flex justify-content-between align-items-center">
                <span>Ticket #${t.id_ticket}</span>
                <span class="badge bg-light text-dark text-capitalize">${t.estado.replace('_', ' ')}</span>
              </div>
              <div class="card-body">
                <p class="mb-1"><strong>Fecha:</strong> ${t.creado_at}</p>
                <p class="mb-1"><strong>Solicitante:</strong> ${t.nombre} ${t.apellido}</p>
                <p class="mb-1"><strong>Email:</strong> ${t.email}</p>
                <p class="mb-1"><strong>DNI:</strong> ${t.dni}</p>
                <p class="mb-1"><strong>Incidencia:</strong> ${t.tipo.replace('_',' ')}</p>
              </div>
              <div class="card-footer text-end">
                <button class="ver-ticket btn btn-sm btn-primary" data-id="${t.id_ticket}">
                  <i class="fas fa-eye"></i> Ver / Editar
                </button>
              </div>
            </div>
          </div>`;
      });

      $c.html(tpl);
    }

    // Al hacer click en Ver/Editar
    $(document).on('click', '.ver-ticket', function(){
      const id = $(this).data('id');
      const t  = allPeticiones.find(x => x.id_ticket === id);
      if (!t) return;
    });    
});
