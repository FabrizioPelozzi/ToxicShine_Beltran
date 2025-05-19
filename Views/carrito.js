$(document).ready(function(){
    Loader();
    // setTimeout(verificar_sesion,2000);
    verificar_sesion();

    // Variables Globales
    let allCarrito = [];
    let searchCarrito = "";

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
                    $("#active_nav_carrito").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito();
                    read_all_carrito();
                }
                else {
                    // 🔐 No hay sesión → redirigir al login
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

    // Busqueda en tiempo real
    $('#buscar_carrito').on('input', function () {
      searchCarrito = $(this).val().trim().toLowerCase();
      renderizar_carrito(filtrar_carrito());
    });

    async function read_all_carrito() {
      const funcion = "leer_carrito";
      let res = await fetch("../Controllers/CarritoController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion
      });
      if (!res.ok) {
        return Swal.fire({ icon: "error", title: res.statusText, text: "Error código: " + res.status });
      }
      try {
        allCarrito = await res.json();
        renderizar_carrito(filtrar_carrito());
      } catch (err) {
        console.error("Error al parsear JSON:", err);
      }
    }

    function filtrar_carrito() {
      if (!searchCarrito) return allCarrito;
      return allCarrito.filter(item =>
        item.titulo.toLowerCase().includes(searchCarrito)
      );
    }

    function renderizar_carrito(lista) {
      const $c = $("#carrito");
      $c.empty();
        
      if (!lista.length) {
        return $c.html(`
          <div class="col-12 d-flex justify-content-center">
            <div class="card text-center shadow-sm p-3 mb-3 bg-white rounded" style="max-width: 400px;">
              <div class="card-body">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <p class="card-text">Tu carrito está vacío.</p>
                <a href="index.php" class="btn btn-primary">Seguir comprando</a>
              </div>
            </div>
          </div>
        `);
      }
  
      lista.forEach(item => {
        const precio = parseFloat(item.precio);
        const cantidad = parseInt(item.cantidad, 10);
        const totalProducto = precio * cantidad;
    
        const card = `
          <div class="col-12 col-md-6 mb-4">
            <div class="card carrito-item h-100">
              
              <div class="card-header">
                <h5>${item.titulo}</h5>
              </div>
              
              <div class="card-body">
                <div class="carrito-info">
                  <p class="descripcion-limitada">${item.descripcion}</p>
                  <p><strong>Categoría:</strong> ${item.categoria}</p>
                  <p><strong>Precio unitario:</strong> $${precio.toFixed(2)}</p>
    
                  <!-- Controles de stock -->
                  <div class="d-flex align-items-center mb-2">
                    <button class="btn btn-danger btn-sm btn-decrementar" data-id="${item.id}">−</button>
                    <input type="number"
                           class="form-control input-cantidad mx-2"
                           value="${cantidad}"
                           min="1"
                           max="${item.stock}"
                           style="width: 60px; text-align: center;"
                           data-id="${item.id}">
                    <button class="btn btn-primary btn-sm btn-incrementar" data-id="${item.id}">+</button>
                  </div>
                  <p><strong>Total:</strong> $<span class="item-total">${totalProducto.toFixed(2)}</span></p>
                </div>
    
                <!-- Imagen a la derecha -->
                <img src="../Util/Img/productos/${item.imagen}"
                     alt="${item.titulo}"
                     class="carrito-img"
                     onerror="this.onerror=null;this.src='../Util/Img/default-product.png';">
              </div>
              
              <div class="card-footer">
                <a href="../Views/descripcion.php?name=${encodeURIComponent(item.titulo)}&id=${encodeURIComponent(item.id_producto)}"
                   class="btn btn-info btn-sm">
                  <i class="fas fa-eye"></i> Ver producto
                </a>
                <button class="btn btn-danger btn-sm eliminar_carrito" data-id="${item.id}">
                  <i class="fas fa-trash-alt"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        `;
        $c.append(card);
      });
  
      // Botones finales
      $("#total_grand").html(`
        <div class="text-end">
          <button class="btn btn-success" id="finalizar_carrito">
            <i class="fas fa-check"></i> Finalizar Carrito
          </button>
        </div>
      `);
    }


    // Función que calcula y actualiza el total de UN ítem
    function actualizar_total_items(id) {
    const $input   = $(`input.input-cantidad[data-id="${id}"]`);
    const cantidad = parseInt($input.val(), 10);

    const textoPrecio = $input
        .closest('.card-body')
        .find('p')
        .filter((i, el) => el.textContent.includes('Precio unitario'))
        .text();
    const precio = parseFloat(textoPrecio.replace(/[^0-9.]/g, ''));

    const totalItem = cantidad * precio;
    $input
        .closest('.card-body')
        .find('.item-total')
        .text(totalItem.toFixed(2));

    $.post(
        "../Controllers/CarritoController.php",
        { funcion: "actualizar_cantidad", id, cantidad },
        function(response) {
            // aquí podrías manejar errores, p.ej.:
            // if (response.trim() !== "success") console.error("No se actualizó la cantidad en servidor");
        }
    );
    }

    // Delegar evento para incrementar cantidad
    $(document).on("click", ".btn-incrementar", function () {
        let id = $(this).data("id");
        let input = $(`input.input-cantidad[data-id="${id}"]`);
        let cantidad = parseInt(input.val());
        let max = parseInt(input.attr("max"));
        if (cantidad < max) {
            input.val(cantidad + 1);
            actualizar_total_items(id);
        }
    });
    
    // Delegar evento para decrementar cantidad
    $(document).on("click", ".btn-decrementar", function () {
        let id = $(this).data("id");
        let input = $(`input.input-cantidad[data-id="${id}"]`);
        let cantidad = parseInt(input.val());
        if (cantidad > 1) {
            input.val(cantidad - 1);
            actualizar_total_items(id);
        }
    });
    
    // Función para actualizar el total de un producto en la vista
    $(document).on("click", "#finalizar_carrito", function () {
        let resumenHtml = "";
        let totalModal = 0;
    
        // Recorrer cada input de cantidad para calcular el total y armar el resumen
        $(".input-cantidad").each(function () {
            let cantidad = parseInt($(this).val());
            let contenedor = $(this).closest(".card-body");
            let precioText = contenedor.find("p:contains('Precio unitario')").text();
            let precio = parseFloat(precioText.replace(/[^0-9.]/g, ""));
            let totalProducto = precio * cantidad;
            totalModal += totalProducto;
    
            let titulo = contenedor.closest(".card").find(".widget-user-username").text();
            let imagen = contenedor.closest(".card").find("img").attr("src");
    
            resumenHtml += `
                <div class="row mb-2">
                    <div class="col-3">
                        <img src="${imagen}" alt="${titulo}" class="img-fluid">
                    </div>
                    <div class="col-6">
                        <strong>${titulo}</strong><br>
                        Cantidad: ${cantidad} x $${precio.toFixed(2)}<br>
                        Total: $${totalProducto.toFixed(2)}
                    </div>
                </div>
                <hr>
            `;
        });
    
        // Mostrar el resumen del carrito en el modal
        $("#resumen_carrito").html(resumenHtml);
        
        // Mostrar el total en el h4 con texto explicativo
        $("#monto_total_span").text("Monto total a pagar: $" + totalModal.toFixed(2));
    
        // Ahora podemos mostrar el modal
        $("#modalFinalizarCarrito").modal("show");
    });
    
    // Evento para "Ir a pagar"
    $(document).on("click", "#ir_a_pagar", async function () {
        let totalText = $("#monto_total_span").text();
        let total = parseFloat(totalText.replace(/[^0-9.]/g, ""));

        console.log("Total enviado al servidor:", total); // Consola para verificar
    
        if (isNaN(total) || total <= 0) {
            Swal.fire("Error", "El total de la compra es inválido.", "error");
            return;
        }
    
        let formData = new URLSearchParams();
        formData.append("total", total);
    
        try {
            const response = await fetch("crear_preferencia.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString()
            });
    
            const text = await response.text();
            console.log("Respuesta cruda de crear_preferencia:", text);
            const data = JSON.parse(text);
            if (data.error) {
              console.error("Detalle MP Errors:", data.mp_errors);
              Swal.fire("Error", data.error + "\nMira consola para más detalles.", "error");
              return;
            }
            window.location.href = data.init_point;

        } catch (error) {
            console.error("Error al crear la preferencia:", error);
            Swal.fire("Error", "No se pudo crear la preferencia de pago.", "error");
        }
    });

    // Evento para eliminar producto del carrito
    $(document).on("click", ".eliminar_carrito", async function () {
    const id = $(this).data("id"); // id del carrito_producto
    const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Este producto se eliminará del carrito.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (confirmacion.isConfirmed) {
        let dataParams = new URLSearchParams();
        dataParams.append("funcion", "eliminar_producto");
        dataParams.append("id", id);

        try {
            const response = await fetch("../Controllers/CarritoController.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: dataParams.toString()
            });

            if (response.ok) {
                const result = await response.text();
                Swal.fire("Eliminado", "El producto fue eliminado del carrito.", "success");
                read_all_carrito(); // Actualiza la vista del carrito
                read_carrito()
            } else {
                Swal.fire("Error", "No se pudo eliminar el producto. Intenta nuevamente.", "error");
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            Swal.fire("Error", "Hubo un problema con la solicitud.", "error");
        }
    }
    });

})
