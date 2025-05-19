$(document).ready(function(){
    Loader();
    //setTimeout(verificar_sesion,1000);
    verificar_sesion();

    // Variables Globales
    let allCompras = [];         
    let selectedDNI = "";
    let selectedStatus = "Pendiente";
    let typingTimer;        
    
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
                    $("#active_nav_registro").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito();
                    $(".estado-filter").removeClass("active");
                    $(".estado-filter[data-status='Pendiente']").addClass("active");
                    buscar_compras_por_dni("");
                } else {
                    // Si no hay sesión redirigir al login
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
                //console.error("Error en verificar_sesion:", error);
            }
    
        } else {
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de código: " + data.status,
            });
        }
    }
    
    // Funcion para filtral segun el boton presionado
    $(".estado-filter").on("click", function(){
        $(".estado-filter").removeClass("active");
        $(this).addClass("active");
        selectedStatus = $(this).data("status");  
        buscar_compras_por_dni(selectedDNI);
    });

    // Función que realiza la búsqueda y actualiza el DataTable.
    $("#dni_busqueda").on("input", function(){
        clearTimeout(typingTimer);
        const dni = $(this).val().trim();
        typingTimer = setTimeout(() => {
          buscar_compras_por_dni(dni);
        }, 300);
    });

    // Función que realiza la búsqueda y actualiza el DataTable.
    async function buscar_compras_por_dni(dni) {
        selectedDNI = dni;
        const params = new URLSearchParams();
        params.append("funcion", "buscar_compras_por_dni");
        params.append("dni", dni);
        params.append("estado", selectedStatus);

        try {
          const res = await fetch("../Controllers/CompraController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString()
          });
          const text = await res.text();
          const compras = JSON.parse(text || "[]");
          allCompras = compras;
          cargar_tabla(allCompras);
        } catch (e) {
          console.error("Error en fetch/compras:", e);
        }
    }    

    // Función que obtiene el detalle de la compra
    document.addEventListener("click", function(e) {
        if (e.target.closest(".ver_detalle_compra")) {
            e.preventDefault();
            const idCompra = e.target.closest(".ver_detalle_compra").dataset.id;
    
            fetch("../Controllers/CompraController.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: "funcion=obtener_detalle_compra&id=" + encodeURIComponent(idCompra)
            })
            .then(response => response.json())
            .then(detalles => {
                //console.log("Detalle de compra:", detalles);
                
                let html = `<h4>Detalle de la Compra</h4>`;
                if (detalles.length > 0) {
                    html += `<table class="table table-bordered">
                                <thead>
                                  <tr>
                                      <th>ID Producto</th>
                                      <th>Nombre</th>
                                      <th>Descripción</th>
                                      <th>Precio de Venta</th>
                                      <th>Cantidad</th>
                                  </tr>
                                </thead>
                                <tbody>`;
                    detalles.forEach(item => {
                        html += `<tr>
                                    <td>${item.id_producto}</td>
                                    <td>${item.nombre_producto}</td>
                                    <td>${item.descripcion}</td>
                                    <td>$${parseFloat(item.precio_venta).toFixed(2)}</td>
                                    <td>${item.cantidad}</td>
                                  </tr>`;
                    });
                    html += `   </tbody>
                              </table>`;
                } else {
                    html += `<p>No se encontraron detalles para esta compra.</p>`;
                }
    
                document.querySelector('#modalDetalleCompra .modal-body').innerHTML = html;
                $('#modalDetalleCompra').modal('show');
            })
            .catch(error => {
                //console.error("Error al obtener el detalle:", error);
                Swal.fire("Error", "No se pudo cargar el detalle de la compra.", "error");
            });
        }
    });

    // Función para cargar la tabla
    function cargar_tabla(data) {
      const $c = $("#compras");
      $c.empty();

      if (!data.length) {
        return $c.html(`
          <div class="col-12 d-flex justify-content-center">
            <div class="card text-center shadow-sm p-3 mb-3 bg-white rounded" style="max-width: 500px; width: 100%;">
              <div class="card-body">
                <i class="fas fa-solid fa-file fa-3x text-muted mb-3"></i>
                <p class="card-text">No se han detectado compras en este momento</p>
              </div>
            </div>
          </div>
        `);
      }


      let tpl = "";
      data.forEach(row => {
        let headerClass, botones;
        switch (row.estado) {
          case "Pendiente":
            headerClass = "bg-primary";
            botones = `
              <a class="ver_detalle_compra btn btn-info btn-sm" data-id="${row.id_compra}" href="#">
                <i class="fas fa-eye"></i> Detalles
              </a>
              <button class="entregar_compra btn btn-success btn-sm" data-id="${row.id_compra}">
                <i class="fas fa-check"></i> Entregado
              </button>
              <button class="cancelar_compra btn btn-danger btn-sm" data-id="${row.id_compra}">
                <i class="fas fa-times"></i> Cancelar
              </button>`;
            break;
          case "Entregado":
            headerClass = "bg-success";
            botones = `
              <a class="ver_detalle_compra btn btn-info btn-sm" data-id="${row.id_compra}" href="#">
                <i class="fas fa-eye"></i> Detalles
              </a>`;
            break;
          case "Cancelado":
            headerClass = "bg-danger";
            botones = `
              <a class="ver_detalle_compra btn btn-info btn-sm" data-id="${row.id_compra}" href="#">
                <i class="fas fa-eye"></i> Detalles
              </a>`;
            break;
          default:
            headerClass = "bg-info";
            botones = `
              <a class="ver_detalle_compra btn btn-info btn-sm" data-id="${row.id_compra}" href="#">
                <i class="fas fa-eye"></i> Detalles
              </a>`;
        }

        tpl += `
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card">
              <!-- Cabecera: Número y Estado -->
              <div class="card-header ${headerClass} text-white d-flex justify-content-between align-items-center">
                <span>Compra N° ${row.id_compra}</span>
                <span class="badge badge-light">${row.estado}</span>
              </div>

              <!-- Cuerpo: Total, DNI y Fecha -->
              <div class="card-body">
              <p class="mb-1"><strong>DNI Cliente:</strong> ${row.dni_cliente}</p> <!-- ✅ AÑADIDO -->
              <p class="mb-0">Fecha: ${row.fecha_compra}</p>
              <p class="mb-1"><strong>Total:</strong> $${parseFloat(row.total).toFixed(2)}</p>
              </div>

              <!-- Pie: Botones -->
              <div class="card-footer text-end">
                ${botones}
              </div>
            </div>
          </div>`;
      });

      $c.html(tpl);
    }

});