$(document).ready(function(){
    Loader();
    //setTimeout(verificar_sesion,1000);
    verificar_sesion();
    
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
    
                    // 🔒 Validación de tipo de usuario
                    if (sesion.id_tipo_usuario != 1 && sesion.id_tipo_usuario != 3) {
                        Swal.fire({
                            icon: "error",
                            title: "Acceso denegado",
                            text: "No tienes permiso para acceder a esta sección."
                        }).then(() => {
                            window.location.href = "../index.php";
                        });
                        return;
                    }
    
                    llenar_menu_superior(sesion);
                    llenar_menu_lateral(sesion);
                    $("#active_nav_registro").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito();
                } else {
                    // 🔐 No hay sesión → redirigir al login
                    Swal.fire({
                        icon: "info",
                        title: "Sesión no iniciada",
                        text: "Por favor inicia sesión para acceder.",
                    }).then(() => {
                        window.location.href = "../Views/login.php";
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

    // Función que realiza la búsqueda y actualiza el DataTable.
    async function buscar_compras_por_dni(dni) {
    const funcion = "buscar_compras_por_dni";
    let responseFetch = await fetch("../Controllers/CompraController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `funcion=${funcion}&dni=${dni}`
    });

    if (!responseFetch.ok) {
        Swal.fire({
            icon: "error",
            title: responseFetch.statusText,
            text: "Hubo un conflicto de código: " + responseFetch.status,
        });
        return;
    }

    let responseText = await responseFetch.text();
    //console.log("Respuesta del servidor:", responseText);

    try {
        let compras = JSON.parse(responseText);
        if (!Array.isArray(compras) || compras.length === 0) {
            //console.info("No hay compras registradas para este DNI.");
            // Podrías vaciar o destruir la tabla si no hay resultados:
            if ($.fn.DataTable.isDataTable("#compras")) {
                $("#compras").DataTable().clear().destroy();
            }
            $("#compras").html("<p>No se encontraron compras.</p>");
            return;
        }

        // Destruir la tabla si ya existe y limpiar el contenedor
        if ($.fn.DataTable.isDataTable("#compras")) {
            $("#compras").DataTable().clear().destroy();
        }
        $("#compras").empty();

        // Inicializar DataTable con la respuesta
        $("#compras").DataTable({
            data: compras,
            aaSorting: [],
            searching: true,
            scrollX: true,
            autoWidth: false,
            responsive: true,
            destroy: true,
            language: espanol,
            columns: [
                {
                    data: null,
                    defaultContent: "",
                    render: function (data, type, row, meta) {
                        return `
                            <div class="card card-widget widget-user-2">
                                <div class="widget-user-header bg-primary">
                                    <div class="widget-user-image">
                                        <img class="img-circle elevation-2" src="../Util/Img/logo.png" alt="Logo">
                                    </div>
                                    <h4 class="widget-user-username">Compra N°: ${row.id_compra}</h4>
                                    <h5 class="widget-user-desc">Fecha: ${row.fecha_compra}</h5>
                                </div>
                                <div class="card-footer p-0">
                                    <div class="card-body pt-2">
                                        <div class="row">
                                            <div class="col-12">
                                                <h2 class="lead"><b>Total: $${parseFloat(row.total).toFixed(2)}</b></h2>
                                            </div>
                                        </div>
                                        <div class="card-footer">
                                            <div class="text-right">
                                                <a class="ver_detalle_compra btn btn-info btn-sm" data-id="${row.id_compra}" href="#">
                                                    <i class="fas fa-eye"></i> Ver detalles
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                    }
                }
            ]
        });
    } catch (error) {
        //console.error("Error al parsear el JSON:", error);
    }
    }

    // Event listener para buscar compras por DNI
    document.getElementById("buscar_dni").addEventListener("click", async function () {
        const dni = document.getElementById("dni_busqueda").value.trim();
        if (dni === "") {
            Swal.fire("Advertencia", "Por favor, ingrese un DNI válido.", "warning");
            return;
        }
        // Llamada única para buscar las compras y actualizar la tabla
        await buscar_compras_por_dni(dni);
    });

    // Event listener para abrir el modal con el detalle de la compra
    document.addEventListener("click", function(e) {
        if (e.target.closest(".ver_detalle_compra")) {
            e.preventDefault();
            // Obtener el ID de la compra, que puede estar encriptado o no según tu elección
            const idCompra = e.target.closest(".ver_detalle_compra").dataset.id;
    
            // Petición al endpoint para obtener el detalle de la compra
            fetch("../Controllers/CompraController.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: "funcion=obtener_detalle_compra&id=" + encodeURIComponent(idCompra)
            })
            .then(response => response.json())
            .then(detalles => {
                //console.log("Detalle de compra:", detalles);
                
                // Ejemplo de armado del contenido del modal
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
    
                // Cargar el contenido en el modal
                document.querySelector('#modalDetalleCompra .modal-body').innerHTML = html;
                // Mostrar el modal (suponiendo que usas Bootstrap, por ejemplo)
                $('#modalDetalleCompra').modal('show');
            })
            .catch(error => {
                //console.error("Error al obtener el detalle:", error);
                Swal.fire("Error", "No se pudo cargar el detalle de la compra.", "error");
            });
        }
    });  
})