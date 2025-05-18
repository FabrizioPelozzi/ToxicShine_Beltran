$(document).ready(function(){
    Loader();
    //setTimeout(verificar_sesion,1000);
    verificar_sesion();

    // Variables Globales
    let allCompras     = [];
    let selectedStatus = "";
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
                    $('.estado-filter[data-status=""]').addClass('active');
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

    $(document).on('click', '.estado-filter', function(){
      $('.estado-filter').removeClass('active');
      $(this).addClass('active');
      selectedStatus = $(this).data('status');
      buscar_compra_por_usuario();
    });
  
    $('#buscar_producto').on('input', function(){
      searchTerm = $(this).val().trim().toLowerCase();
      read_all_pedidos(filtrar_compra());
    });

      // Función principal de carga
    async function buscar_compra_por_usuario() {
        const params = new URLSearchParams({
          funcion: "buscar_compras_por_usuario",
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
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div class="card h-100">
                <div class="card-header ${headerClass} text-white d-flex justify-content-between">
                  <span>Pedido #${row.id_compra}</span>
                  <span class="badge bg-light text-dark">${row.estado}</span>
                </div>
                <div class="card-body">
                  <p><strong>Fecha:</strong> ${row.fecha_compra}</p>
                  <p><strong>Total:</strong> $${parseFloat(row.total).toFixed(2)}</p>
                  <details>
                    <summary>Ver productos</summary>
                    <ul>${listaProductos}</ul>
                  </details>
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