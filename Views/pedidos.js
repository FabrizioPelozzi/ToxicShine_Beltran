$(document).ready(function(){
    Loader();
    //setTimeout(verificar_sesion,1000);
    verificar_sesion();

    // Variables Globales
    let allCompras     = [];
    let selectedStatus = "Pendiente";
    let searchTerm     = "";

    // Cargar Pagina
    async function verificar_sesion() {
        funcion = "verificar_sesion";
        let data = await fetch("../Controllers/UsuarioController.php",{
            method:"POST",
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body: "funcion=" +funcion

        })
        if (data.ok) {
            let response = await data.text();
            try {
                if (response !="") {
                    let sesion =JSON.parse(response);
                    //console.log(sesion);
                    llenar_menu_superior(sesion);
                    llenar_menu_lateral(sesion);
                    $("#active_nav_pedidos").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito();
                    $(".estado-filter").removeClass("active");
                    $(".estado-filter[data-status='Pendiente']").addClass("active");
                    buscar_compra_por_usuario();
                }
                else {
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

    // Funcion para filtral segun el boton presionado
    $(document).on('click', '.estado-filter', function(){
      $('.estado-filter').removeClass('active');
      $(this).addClass('active');
      selectedStatus = $(this).data('status');
      buscar_compra_por_usuario();
    });
  
    // Función que realiza la búsqueda y actualiza el DataTable
    $('#buscar_producto').on('input', function(){
      searchTerm = $(this).val().trim().toLowerCase();
      read_all_pedidos(filtrar_compra());
    });

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

    // Función principal de carga
    async function buscar_compra_por_usuario() {
        const params = new URLSearchParams({
          funcion: "buscar_compras_por_dni",
          estado: selectedStatus
        });
        const res  = await fetch("../Controllers/CompraController.php", {
          method: "POST",
          body: params.toString(),
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        const text    = await res.text();
        allCompras    = JSON.parse(text || "[]");
        read_all_pedidos(filtrar_compra());
    }

    // Función de filtrado de productos
    function filtrar_compra(){
        return allCompras
          .filter(c => !selectedStatus || c.estado === selectedStatus)
          .filter(c => {
            if (!searchTerm) return true;
            return c.productos.some(p =>
              p.nombre_producto.toLowerCase().includes(searchTerm)
            );
          });
    }

    // Función carga de todos los pedidos
    function read_all_pedidos(data) {
        const $c = $('#compras');
        $c.empty();
        if (!data.length) {
          return $c.html(`
            <div class="col-12 d-flex justify-content-center">
              <div class="card text-center shadow-sm p-3 mb-3 bg-white rounded" style="max-width: 400px;">
                <div class="card-body">
                  <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                  <p class="card-text">¡Todavía no has realizado ninguna compra!</p>
                </div>
              </div>
            </div>`);
        }

        let tpl = '';
        data.forEach(row => {
          // Color por estado
          let headerClass;
          switch (row.estado) {
            case "Pendiente":  headerClass = "bg-primary";  break;
            case "Entregado":  headerClass = "bg-success";  break;
            case "Cancelado":  headerClass = "bg-danger";   break;
            default:           headerClass = "bg-secondary"; break;
          }
          // Lista desplegable de productos
          const listaProductos = row.productos.map(p =>
            `<li>${p.nombre_producto} x${p.cantidad} ($${parseFloat(p.precio_venta).toFixed(2)})</li>`
          ).join('');
        
           tpl += `
            <div class="col-12 col-sm-4 col-md-4 col-lg-2 mb-4">
              <div class="card h-100">
                <div class="card-header ${headerClass} text-white d-flex justify-content-between align-items-center">
                  <!-- Título siempre a la izquierda -->
                  <span>Pedido #${row.id_compra}</span>
                  <!-- Estado siempre a la derecha -->
                  <span class="badge bg-light text-dark">${row.estado}</span>
                </div>
                <div class="card-body">
                  <p><strong>Fecha:</strong> ${row.fecha_compra}</p>
                  <p><strong>Total:</strong> $${parseFloat(row.total).toFixed(2)}</p>
                </div>
                <div class="card-footer text-end">
                  <a class="ver_detalle_compra btn btn-info btn-sm" data-id="${row.id_compra}" href="#">
                    <i class="fas fa-eye"></i> Detalles
                  </a>
                </div>
              </div>
            </div>`;
        });
        $c.html(tpl);
      
        // Re-attach detalle
        $('.ver_detalle_compra').off('click').on('click', function(e){
          e.preventDefault();
          const id = $(this).data('id');
          // tu modal de detalle…
        });
    }
});