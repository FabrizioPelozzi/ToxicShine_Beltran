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

    function llenar_menu_superior(usuario) {
        let template = "";
        let template2 = "";
    
        if (!usuario) {
            template = `
                <li class="nav-item">
                    <a class="nav-link" href="../Views/register.php" role="button">
                        <i class="fas fa-user-plus"></i> Registrarse
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="../Views/login.php" role="button">
                        <i class="far fa-user"></i> Iniciar sesión
                    </a>
                </li>
            `;
        } else {
            const displayName = usuario.nombre?.trim() || usuario.email;
    
            // Mostrar favoritos y carrito solo si es tipo 2 o 3 (usuario o superadmin)
            if (usuario.id_tipo_usuario == 2 || usuario.id_tipo_usuario == 3) {
                template += `
                    <li id="carrito_menu" class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                            <i class="fas fa-shopping-cart"></i>
                            <span id="carrito_contador" class="badge badge-danger navbar-badge"></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" id="carrito_menu_lista">
                            <span class="dropdown-item dropdown-header">Carrito vacío</span>
                        </div>
                    </li>
                    <li id="favorito" class="nav-item dropdown"></li>
                `;
            }
    
            // Dropdown del usuario
            template2 = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                        <img src="../Util/img/avatar5.png" width="30" height="30" class="img-fluid img-circle">
                        <span>Hola, ${displayName}!</span>
                    </a>
                    <ul class="dropdown-menu">
                        ${usuario.id_tipo_usuario != 1 ? `
                            <li>
                                <a class="dropdown-item" href="#" id="abrirModalPerfil">
                                    <i class="fas fa-user-cog"></i> Modificar perfil
                                </a>
                            </li>` : ""}
                        <li>
                            <a class="dropdown-item" href="../Controllers/logout.php">
                                <i class="fas fa-user-times"></i> Cerrar sesión
                            </a>
                        </li>
                    </ul>
                </li>
            `;
        }
    
        $("#loader_1").hide(500);
        $("#menu_superior").html(template + template2);
    }             
      
    function llenar_menu_lateral(usuario) {
        let template = "";
    
        // Botón accesible para todos los usuarios (incluso visitantes si se desea)
        template += `
            <li class="nav-header">Explorar</li>
            <li id="nav_todos_productos" class="nav-item">
                <a id="active_nav_todos_productos" href="../index.php" class="nav-link">
                    <i class="fas fa-store nav-icon"></i>
                    <p>Ver todos los productos</p>
                </a>
            </li>
        `;
    
        if (usuario) {
            // Mostrar perfil si es usuario o superadmin
            if (usuario.id_tipo_usuario == 2 || usuario.id_tipo_usuario == 3) {
                template += `
                    <li class="nav-header">Perfil</li>
                    <li id="nav_favoritos" class="nav-item">
                        <a id="active_nav_favoritos" href="../Views/Favoritos.php" class="nav-link">
                            <i class="far fa-heart nav-icon"></i>
                            <p id="nav_cont_fav">Favoritos</p>
                        </a>
                    </li>
                    <li id="nav_carrito" class="nav-item">
                        <a id="active_nav_carrito" href="../Views/Carrito.php" class="nav-link">
                            <i class="fas fa-shopping-cart nav-icon"></i>
                            <p id="nav_cont_carrito">Carrito</p>
                        </a>
                    </li>
                `;
            }
    
            // Mostrar administración si es admin o superadmin
            if (usuario.id_tipo_usuario == 1 || usuario.id_tipo_usuario == 3) {
                template += `
                    <li class="nav-header">Administración</li>
                    <li id="nav_categorias" class="nav-item">
                        <a id="active_nav_categorias" href="../Views/Categorias.php" class="nav-link">
                            <i class="nav-icon fas fa-apple-alt"></i>
                            <p id="nav_cont_cat">Categorías</p>
                        </a>
                    </li>
                    <li id="nav_productos" class="nav-item">
                        <a id="active_nav_productos" href="../Views/Productos.php" class="nav-link">
                            <i class="nav-icon fas fa-box"></i>
                            <p id="nav_cont_prod">Productos</p>
                        </a>
                    </li>
                    <li id="nav_registro" class="nav-item">
                        <a id="active_nav_registro" href="../Views/registro.php" class="nav-link">
                            <i class="nav-icon fas fa-file-alt"></i>
                            <p id="nav_cont_reg">Registros de venta</p>
                        </a>
                    </li>
                `;
            }
        }
    
        $("#loader_2").hide(500);
        $("#menu_lateral").html(template);
    }     

    async function read_favoritos(){
        let funcion = "read_favoritos";
        let data = await fetch("../Controllers/FavoritoController.php", {
            method:"POST",
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body: "funcion=" + funcion
        });
        if (data.ok) {
            let response = await data.text();
            try {
                let favoritos = JSON.parse(response);
                let template1 = "";
                let template = `
                    <a class="nav-link" data-toggle="dropdown" href="#">`;
                if (favoritos.length == 0) {
                    template += `<i class="far fa-heart"></i>`;
                    template1 += `Favoritos`;
                } else {
                    template += `
                        <i class="far fa-heart"></i>
                        <span class="badge badge-warning navbar-badge">${favoritos.length}</span>`;
                    template1 += `
                        Favoritos <span class="badge badge-warning right">${favoritos.length}</span>`;
                }
                template += `</a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">`;
                template += `<span class="dropdown-item dropdown-header">${favoritos.length} Favoritos</span>`;
                favoritos.forEach(favorito => {
                    template += generarEnlaceProducto({
                        url: favorito.url,
                        imagen: favorito.imagen,
                        titulo: favorito.titulo,
                        precio: favorito.precio,
                        cantidad: 1  // Si aplica cantidad en favoritos, ajusta según corresponda
                    });
                });
                template += `<a href="../Views/favoritos.php" class="dropdown-item dropdown-footer">Ver todos tus favoritos</a></div>`;
                $("#nav_cont_fav").html(template1);
                $("#favorito").html(template);
            } catch (error) {
                //console.error(error);
                //console.log(response);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de codigo: " + data.status,
            });
        }
    }    

    async function read_carrito() {
        let funcion = "leer_carrito";
        let data = await fetch("../Controllers/CarritoController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "funcion=" + funcion
        });
    
        if (data.ok) {
            let response = await data.text();
            try {
                let carrito = JSON.parse(response);
                // Depuración: imprime el JSON para ver la estructura
                //console.log("Carrito:", carrito);
                
                let template = `
                    <a class="nav-link" data-toggle="dropdown" href="#">
                        <i class="fas fa-shopping-cart"></i>
                        ${carrito.length > 0 ? `<span class="badge badge-danger navbar-badge">${carrito.length}</span>` : ""}
                    </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">`;
                template += `<span class="dropdown-item dropdown-header">${carrito.length} Productos en el carrito</span>`;
        
                carrito.forEach(item => {
                    template += generarEnlaceProducto(item);
                });
        
                template += `
                    <div class="dropdown-divider"></div>
                    <a href="../Views/carrito.php" class="dropdown-item dropdown-footer">
                        Ver todos los productos del carrito
                    </a>
                </div>`;
        
                $("#carrito_menu").html(template);

                if (carrito.length > 0) {
                    $("#nav_cont_carrito").html(`Carrito <span class="badge badge-danger right">${carrito.length}</span>`);
                } else {
                    $("#nav_cont_carrito").html(`Carrito`);
                }
            } catch (error) {
                //console.error(error);
                //console.log(response);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de código: " + data.status,
            });
        }
    }

    function generarEnlaceProducto(data) {
        let url;
        if (data.url) {
            // Si ya viene la URL, úsala directamente
            url = data.url;
        } else {
            // Sino, se genera dinámicamente usando id_producto (o id)
            let idParam = data.id_producto || data.id;
            if (!idParam) {
                //console.error("No se encontró ID para el producto:", data);
                idParam = "";
            }
            url = `Views/descripcion.php?name=${encodeURIComponent(data.titulo)}&&id=${encodeURIComponent(idParam)}`;
        }
        return `
            <div class="dropdown-divider"></div>
            <a href="../${url}" class="dropdown-item">
                <div class="media">
                    <img src="../Util/img/productos/${data.imagen}" alt="Imagen del producto" class="img-size-50 img-circle mr-3">
                    <div class="media-body">
                        <h3 class="dropdown-item-title">${data.titulo}</h3>
                        <p class="text-sm text-muted">Cantidad: ${data.cantidad}</p>
                        <p class="text-sm text-muted">Precio: $${data.precio}</p>
                    </div>
                </div>
            </a>
            <div class="dropdown-divider"></div>
        `;
    }   
    
   
    // Alerta
    function Loader(mensaje = "Cargando datos...") {
        Swal.fire({
            position: "center",
            title: mensaje,
            html: `
                <div style="min-height: 60px; display: flex; justify-content: center; align-items: center;">
                    <i class="fas fa-2x fa-sync-alt fa-spin"></i>
                </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: true,
            didOpen: () => {
                document.body.style.overflow = "hidden";
            },
            willClose: () => {
                document.body.style.overflow = "auto";
            }
        });
    }    
    
    function CloseLoader(mensaje = "", tipo = "success") {
        if (mensaje === "") {
            Swal.close();
        } else {
            Swal.fire({
                position: "center",
                icon: tipo,
                title: mensaje,
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    // Configs
    const espanol = {
        "sProcessing":     "Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sZeroRecords":    "No se encontraron resultados",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":    "",
        "sSearch":         "Buscar:",
        "sUrl":            "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Primero",
            "sLast":     "Último",
            "sNext":     "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    };

    toastr.options ={
        "debug": false,
        "positionClass": "toast-bottom-full-width",
        "onclick":null,
        "fadein":300,
        "fadeOut":1000,
        "timeOut":5000,
        "extendedTimeOut":1000
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