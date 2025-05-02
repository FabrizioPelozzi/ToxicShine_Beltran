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
                    $("#active_nav_productos").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito();
                    read_all_productos();
                    obtener_categorias();
                    
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

    async function read_all_productos() {
        const funcion = "read_all_productos";
        let data = await fetch("../Controllers/ProductoController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "funcion=" + funcion
        });
        
        if (data.ok) {
            let response = await data.text();
            try {
                let productos = JSON.parse(response);
                
                const table = $("#productos").DataTable({
                    data: productos,
                    order: [[1, 'desc']],
                    columnDefs: [
                        { targets: 2, orderable: false }
                      ],                             // orden inicial por fecha_edicion desc
                    searching: true,
                    scrollX: true,
                    autoWidth: false,
                    responsive: true,
              
                    // 2) DOM y botones
                    dom:
                     "<'container-fluid mb-3'" +
                       "<'d-flex flex-wrap justify-content-between align-items-center gap-2'" +
                         "<'ordenar-btns'B>" +
                         "<'search-box'f>" +
                       ">" +
                     ">" +
                     "<'row'<'col-12'tr>>" +
                     "<'row mt-2'<'col-md-6'i><'col-md-6'p>>",

                      buttons: [
                        {
                          extend: 'collection',
                          text: 'Ordenar por',
                          buttons: [
                            {
                              text: 'Edición ↓',
                              action: function (e, dt, node, config) {
                                dt.order([1, 'desc']).draw();
                              }
                            },
                            {
                              text: 'Edición ↑',
                              action: function (e, dt, node, config) {
                                dt.order([1, 'asc']).draw();
                              }
                            },
                            {
                              text: 'Creación ↓',
                              action: function (e, dt, node, config) {
                                dt.order([0, 'desc']).draw();
                              }
                            },
                            {
                              text: 'Creación ↑',
                              action: function (e, dt, node, config) {
                                dt.order([0, 'asc']).draw();
                              }
                            },
                            {
                              text: 'Nombre A → Z',
                              action: function (e, dt, node, config) {
                                dt.order([2, 'asc']).draw();
                              }
                            },
                            {
                              text: 'Nombre Z → A',
                              action: function (e, dt, node, config) {
                                dt.order([2, 'desc']).draw();
                              }
                            }
                          ]
                        }
                      ],
                      
                      
                    columns: [
                        { data: 'fecha_creacion', visible: false },
                        { data: 'fecha_edicion', visible: false },
                        {
                            "render": function (data, type, dato, meta) {
                                let descripcionCorta = dato.descripcion.length > 100 ? dato.descripcion.substring(0, 100) + '...' : dato.descripcion;

                                let template = `
                                <div class="container-fluid px-2 px-md-4">
                                  <div class="row justify-content-center">
                                    <div class="col-12 col-md-10 col-lg-8">
                                      <div class="card card-widget widget-user-2">
                                        <div class="widget-user-header bg-success d-flex align-items-center justify-content-between">
                                          <div class="widget-user-image">
                                            <img class="img-circle elevation-2" src="../Util/Img/logo.png" alt="User Avatar">
                                          </div>
                                          <h4 class="widget-user-username mb-0">${dato.nombre_producto}</h4>
                                        </div>

                                        <div class="card-body pt-2">
                                          <div class="row g-2 align-items-center">
                                            <!-- Info del producto -->
                                            <div class="col-12 col-md-7">
                                              <h2 class="lead"><b>Categoria</b></h2>
                                              <p class="text-muted text-sm"><b>${dato.nombre_categoria}</b></p>
                                              <h2 class="lead"><b>Descripcion</b></h2>
                                              <p class="text-muted text-sm"><b>${descripcionCorta}</b></p>
                                              ${dato.descripcion.length > 100 ? `<a href="#" class="text-info ver-mas" data-descripcion="${dato.descripcion.replace(/"/g, '&quot;')}">Ver más</a>` : ''}
                                              <h2 class="lead"><b>Precio</b></h2>
                                              <p class="text-muted text-sm"><b>${dato.precio_venta}</b></p>
                                              <h2 class="lead"><b>Stock</b></h2>
                                              <p class="text-muted text-sm"><b>${dato.stock}</b></p>
                                            </div>

                                            <!-- Imagen -->
                                            <div class="col-12 col-md-5 text-center">
                                              <img class="img-fluid rounded shadow-sm mx-auto d-block" style="max-height: 200px; object-fit: contain;" src="../Util/Img/productos/${dato.imagen_principal}" alt="${dato.nombre_producto}">
                                            </div>
                                          </div>
                                        </div>

                                        <div class="card-footer">
                                          <div class="d-flex justify-content-end flex-wrap gap-2">
                                            <a class="editar_datos btn btn-info btn-sm" data-id="${dato.id_producto}" href="#">
                                              <i class="fas fa-pencil-alt"></i> Editar datos
                                            </a>
                                            <a class="editar_imagenes btn btn-info btn-sm" data-id="${dato.id_producto}" href="#">
                                              <i class="fas fa-pencil-alt"></i> Editar imágenes
                                            </a>
                                            <a class="eliminar_producto btn btn-danger btn-sm" data-id="${dato.id_producto}" href="#">
                                              <i class="fas fa-trash"></i> Eliminar
                                            </a>
                                          </div>
                                        </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                                 </div>`;


                                return template;
                            }
                        }                        
                    ],
                    "destroy": true,
                    "language": espanol
                });
            } catch (error) {
                //console.error("Error al parsear el JSON:", error);
                //console.log("Respuesta del servidor:", response);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de código: " + data.status,
            });
        }
    }
    
    $(document).on('click', '.ver-mas', function (e) {
        e.preventDefault();
        const descripcion = $(this).data('descripcion');
        Swal.fire({
            title: 'Descripción completa',
            html: `<div style="text-align: left; font-size: 15px;">${descripcion}</div>`,
            confirmButtonText: 'Cerrar',
            width: 600,
            padding: '2em',
        });
    });    
    
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

    // Crear producto
    // Eventos para incrementar y disminuir stock en el modal de creación
    $(document).on('click', '#btnIncrementCrear', function() {
    let currentStock = parseInt($('#stock_producto').val()) || 0;
    $('#stock_producto').val(currentStock + 1);
    });

    $(document).on('click', '#btnDecrementCrear', function() {
    let currentStock = parseInt($('#stock_producto').val()) || 0;
    if (currentStock > 0) {
        $('#stock_producto').val(currentStock - 1);
    }
    });

    // Configuración del validador y envío del formulario para crear producto
    $.validator.setDefaults({
        submitHandler: function () {
            let funcion = "crear_producto";
            let categoria_producto = $("#categoria_producto2").val();
            let descripcion_producto = $("#descripcion_producto").val();
            let precio_producto = $("#precio_producto").val();
            let nombre_producto = $("#nombre_producto").val();
            let stock = $("#stock_producto").val();
            let imagen_producto = $("#imagen_producto")[0].files[0];
    
            let formData = new FormData();
            formData.append("funcion", funcion);
            formData.append("nombre_producto", nombre_producto);
            formData.append("categoria_producto", categoria_producto);
            formData.append("descripcion_producto", descripcion_producto);
            formData.append("precio_producto", precio_producto);
            formData.append("stock", stock);
            
            // Solo agregar la imagen si se seleccionó una nueva
            if (imagen_producto) {
                formData.append("imagen_producto", imagen_producto);
            }
    
            $.ajax({
                url: "../Controllers/ProductoController.php",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    response = $.trim(response);
                    switch (response) {
                        case "success":
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Se ha cargado su nuevo producto",
                                showConfirmButton: false,
                                timer: 1000
                            }).then(() => {
                                $('#modal_crear_producto').modal('hide');
                                read_all_productos();
                            });
                            break;
                
                        case "reactivada":
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Producto reactivado correctamente",
                                showConfirmButton: false,
                                timer: 1000
                            }).then(() => {
                                $('#modal_crear_producto').modal('hide');
                                read_all_productos();
                            });
                            break;
                
                        case "producto_existente":
                            Swal.fire({
                                icon: "warning",
                                title: "Duplicado",
                                text: "Ya existe un producto con ese nombre",
                            });
                            break;
                
                        default:
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Hubo conflicto al agregar el producto",
                            });
                    }
                },                
            });
        }
    });
    
    // Inicialización del validador para el formulario de creación
    $('#form-producto').validate({
    rules: {
        nombre_producto: {
            required: true,
        },
        categoria_producto2: {
            required: true,
        },
        descripcion_producto: {
            required: true,
        },
        precio_producto: {
            required: true,
            number: true,
            min: 10
        },
        imagen_producto: {
            required: true,
            extension: "jpg|jpeg|png|gif"
        },
        stock: {
            required: true,
            digits: true,
            min: 0
        }
    },
    messages: {
        nombre_producto: {
            required: "Ingrese un nombre para el producto",
        },
        categoria_producto2: {
            required: "Seleccione una categoría",
        },
        descripcion_producto: {
            required: "Ingrese una descripción del producto",
        },
        precio_producto: {
            required: "Ingrese un precio",
            number: "Debe ser un número válido",
            min: "El precio no puede ser negativo"
        },
        imagen_producto: {
            required: "Seleccione una imagen",
            extension: "La imagen debe ser de tipo JPG, JPEG, PNG o GIF"
        },
        stock: {
            required: "Ingrese la cantidad de stock",
            digits: "El stock debe ser un número entero",
            min: "El stock no puede ser negativo"
        }
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.mb-3').append(error);
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid').removeClass('is-valid');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid').addClass('is-valid');
    },
    });

    // Obtener las categorias para crear o editar un producto
    function obtener_categorias(id_categoria_producto = null) {
        $.post('../Controllers/CategoriaController.php', {funcion: 'read_all_categorias'}, (response) => {
            try {
                const categorias = JSON.parse(response);
                ////console.log(categorias)
                let opciones = '<option value="">Seleccione una categoría</option>';
                categorias.forEach(categoria => {
                    opciones += `<option value="${categoria.id_categoria}">${categoria.nombre_categoria}</option>`;
                });
                $('#categoria_producto').html(opciones);
                $('#categoria_producto2').html(opciones);
    
                // Si existe una categoría del producto, seleccionarla
                if (id_categoria_producto) {
                    $('#categoria_producto').val(id_categoria_producto);
                }
            } catch (error) {
                //console.error("Error al procesar las categorías:", error);
                $('#categoria_producto').html('<option value="">Error al cargar las categorías</option>');
            }
        });
    }   

    // Editar producto
    // Abrir modal

    $(document).on('click', '.editar_datos', (e) => {
        e.preventDefault();
        let id_producto_seleccionado = $(e.target).data('id');
    
        cargar_datos_producto(id_producto_seleccionado, (id_categoria_producto) => {
            obtener_categorias(id_categoria_producto);
        });
    
        $('#modal_modificar_producto').modal('show');
    });  

    // Obtener datos de producto
    function cargar_datos_producto(id_producto, callback) {
        $.post('../Controllers/ProductoController.php', {funcion: 'obtener_producto', id_producto: id_producto}, (response) => {
            try {
                let producto = JSON.parse(response);
                $('#id_producto_mod').val(producto.id_producto);
                $('#nombre_producto_mod').val(producto.nombre_producto);
                $('#descripcion_mod').val(producto.descripcion);
                $('#precio_venta_mod').val(producto.precio_venta);
                $('#imagen_actual').val(producto.imagen_principal);
                $('#stock_input').val(producto.stock);
                // Asumiendo que la imagen se encuentra en ../Util/Img/productos/
                $('#imagen_preview').attr('src', '../Util/Img/productos/' + producto.imagen_principal);
                callback(producto.id_categoria);
            } catch (error) {
                //console.error('Error al parsear la respuesta:', error);
            }
        });
    }        

    // Configuración de la validación del formulario
    $.validator.setDefaults({
        submitHandler: function () {
            let funcion = "editar_producto";  // Cambiar 'crear_producto' a 'editar_producto'
            let id_producto = $("#id_producto_mod").val();  // Obtener ID del producto
            let categoria_producto = $("#categoria_producto").val();
            let descripcion_producto = $("#descripcion_mod").val();
            let precio_producto = $("#precio_venta_mod").val();
            let nombre_producto = $("#nombre_producto_mod").val();
            let stock = $("#stock_input").val();
            let imagen_actual = $("#imagen_actual").val();  // Mantener la imagen actual
        
            let formData = new FormData();
            formData.append("funcion", funcion);
            formData.append("id_producto", id_producto);  // Agregar el ID del producto
            formData.append("nombre_producto", nombre_producto);
            formData.append("categoria_producto", categoria_producto);
            formData.append("descripcion", descripcion_producto);
            formData.append("precio_venta", precio_producto);
            formData.append("stock", stock);
            formData.append("imagen_actual", imagen_actual);
        
            // Solo agregar la nueva imagen si se seleccionó una
            const fileInput = $("#imagen_principal_mod")[0];
            if (fileInput.files.length) {
                formData.append("imagen_principal_mod", fileInput.files[0]);
            }
        
            $.ajax({
                url: "../Controllers/ProductoController.php",  
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    response = $.trim(response);
                    console.log("Editar producto →", response);
        
                    switch (response) {
                        case "success":
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Producto actualizado correctamente",
                                showConfirmButton: false,
                                timer: 1000
                            }).then(() => {
                                $('#modal_modificar_producto').modal('hide');
                                read_all_productos();  // Releer la lista de productos
                            });
                            break;
        
                        case "producto_existente":
                            Swal.fire({
                                icon: "warning",
                                title: "Duplicado",
                                text: "Ya existe un producto con ese nombre",
                            });
                            break;
        
                        default:
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Hubo un conflicto al editar el producto",
                            });
                    }
                },
                error: function(xhr, status, err) {
                    console.error("AJAX Error:", status, err);
                }
            });
        }   
    });
           
    $('#form-modificar-producto').validate({
    rules: {
        nombre_producto_mod: {
            required: true,
        },
        categoria_producto: {
            required: true,
        },
        descripcion_mod: {
            required: true,
        },
        precio_venta_mod: {
            required: true,
            number: true,
            min: 0.01
        },
        imagen_principal_mod: {
            extension: "jpg|jpeg|png|gif"
        },
        stock: {
            required: true,
            digits: true,
            min: 0
        }
    },
    messages: {
        nombre_producto_mod: {
            required: "Ingrese un nombre para el producto",
        },
        categoria_producto: {
            required: "Seleccione una categoría",
        },
        descripcion_mod: {
            required: "Ingrese una descripción del producto",
        },
        precio_venta_mod: {
            required: "Ingrese un precio",
            number: "Debe ser un número válido",
            min: "El precio debe ser mayor a 0"
        },
        imagen_principal_mod: {
            extension: "La imagen debe ser de tipo JPG, JPEG, PNG o GIF"
        },
        stock: {
            required: "Ingrese la cantidad de stock",
            digits: "El stock debe ser un número entero",
            min: "El stock no puede ser negativo"
        }
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.mb-3').append(error);
    },
    highlight: function (element) {
        $(element).addClass('is-invalid').removeClass('is-valid');
    },
    unhighlight: function (element) {
        $(element).removeClass('is-invalid').addClass('is-valid');
    },
    });

    // Incrementar stock
    $(document).on('click', '#btnIncrement', function() {
        let currentStock = parseInt($('#stock_input').val()) || 0;
        $('#stock_input').val(currentStock + 1);
    });

    // Disminuir stock
    $(document).on('click', '#btnDecrement', function() {
        let currentStock = parseInt($('#stock_input').val()) || 0;
        if (currentStock > 0) { // Evitar valores negativos
            $('#stock_input').val(currentStock - 1);
        }
    });

    // Editar Carrusel Imagenes

    // Abrir modal para editar imágenes
    // Al hacer clic en "Editar imagenes"
    $(document).on("click", ".editar_imagenes", function (e) {
        e.preventDefault();
        $("#productoId").val("");
        let id_producto_seleccionado = $(e.currentTarget).data("id");
        // //console.log("Click en editar_imagenes. ID del producto obtenido:", id_producto_seleccionado);
        $("#productoId").val(id_producto_seleccionado);
        // //console.log("Campo oculto productoId actualizado a:", $("#productoId").val());
        cargar_imagenes_producto(id_producto_seleccionado);
        $("#modal_editar_imagenes").modal("show");
    });       
    
    // Cargar Imagenes
    function cargar_imagenes_producto(id_producto) {
        $.post("../Controllers/ProductoController.php", {
            funcion: "obtener_imagenes",
            id_producto: id_producto
        }, function(response) {
            try {
                let imagenes = JSON.parse(response);
                let template = "";
    
                imagenes.forEach((imagen) => {
                    template += `
                        <div class="row mb-2 imagen-vieja" data-id="${imagen.id}">
                            <div class="col-4">
                                <img src="../Util/Img/carrusel/${imagen.nombre}" class="img-fluid img-thumbnail" alt="Imagen">
                            </div>
                            <div class="col-4">
                                <input type="text" class="form-control" value="${imagen.nombre}" readonly>
                            </div>
                            <div class="col-2">
                                <select class="form-control estado-imagen">
                                    <option value="A" ${imagen.estado == "A" ? "selected" : ""}>Activo</option>
                                    <option value="I" ${imagen.estado == "I" ? "selected" : ""}>Inactivo</option>
                                </select>
                            </div>
                            <div class="col-2 text-center">
                                <button type="button" class="btn btn-danger btn-sm btn-eliminar-fila">
                                    <i class="fas fa-trash"></i> Borrar
                                </button>
                            </div>
                            <!-- Usamos un input hidden para guardar el id real y el tipo -->
                            <input type="hidden" class="id-imagen" value="${imagen.id}">
                            <input type="hidden" class="tipo-imagen" value="vieja">
                        </div>`;
                });
    
                $("#contenedor_imagenes").html(template);
            } catch (error) {
                //console.error("Error al parsear imágenes:", error);
            }
        });
    }
    
    // Evento para agregar filas nuevas
    $(document).on("click", "#btn_agregar_imagen", function () {
        let nuevaImagenHTML = `
            <div class="row mb-2 imagen-nueva">
                <div class="col-4">
                    <!-- Asegúrate de que el input file tenga un name o se use en el FormData -->
                    <input type="file" class="form-control imagen-input">
                </div>
                <div class="col-4">
                    <input type="text" class="form-control" placeholder="Nombre de la imagen" disabled>
                </div>
                <div class="col-2">
                    <select class="form-control estado-imagen">
                        <option value="A">Activo</option>
                        <option value="I">Inactivo</option>
                    </select>
                </div>
                <div class="col-2 text-center">
                    <button type="button" class="btn btn-danger btn-sm btn-eliminar-fila">
                        <i class="fas fa-trash"></i> Borrar
                    </button>
                </div>
                <!-- Para imágenes nuevas, el id se marca como "nueva" y se envía el tipo -->
                <input type="hidden" class="id-imagen" value="nueva">
                <input type="hidden" class="tipo-imagen" value="nueva">
            </div>
`;
        $("#contenedor_imagenes").append(nuevaImagenHTML);
    });

    // Guardar imágenes
    $.validator.setDefaults({
        submitHandler: function () {
            let formData = new FormData();
            formData.append("funcion", "guardar_imagenes");
            
            // Toma el id desde el campo oculto y registra en consola
            let idProducto = $("#productoId").val();
            ////console.log("En submit, id_producto =", idProducto);
            formData.append("id_producto", idProducto);
            
            // Iterar sobre las imágenes
            $("#contenedor_imagenes .row").each(function () {
                let imagenInput = $(this).find(".imagen-input")[0]; 
                let estado      = $(this).find(".estado-imagen").val();
                let id_imagen   = $(this).find(".id-imagen").val();
                let tipo        = $(this).find(".tipo-imagen").val();
                
                // //console.log("Procesando imagen - ID:", id_imagen, "Tipo:", tipo);
                
                if (imagenInput && imagenInput.files.length > 0) {
                    formData.append("imagenes[]", imagenInput.files[0]);
                } else {
                    formData.append("imagenes[]", ""); 
                }
                
                formData.append("estados[]", estado);
                formData.append("ids[]", id_imagen);
                formData.append("tipos[]", tipo);
            });
            
            $.ajax({
                url: "../Controllers/ProductoController.php",
                method: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    // //console.log("Respuesta del servidor:", response);
                    if (response.trim() === "success") {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Cambios guardados exitosamente",
                            showConfirmButton: false,
                            timer: 1000
                        }).then(function () {
                            $('#modal_editar_imagenes').modal('hide');
                            read_all_productos();
                        });
                    } else {
                        Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
                    }
                }
            });
        }
    });
    
    // Validación del modal para las imágenes
    $('#form_editar_imagenes').validate({
        rules: {
            'imagenes[]': {
                required: true, 
                extension: "jpg|jpeg|png|gif"
            },
        },
        messages: {
            'imagenes[]': {
                required: "Suba una imagen o elimine el campo",
                extension: "La imagen debe ser de tipo JPG, JPEG, PNG o GIF"
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.mb-3').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
            $(element).removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
            $(element).addClass('is-valid');
        },
    });

    // Evento para borrar imagen
    $(document).on("click", ".btn-eliminar-fila", function (e) {
        e.preventDefault();

        // Obtén la fila que contiene la imagen
        let row = $(this).closest(".row");
        // Extrae el ID y el tipo de imagen (nueva o vieja)
        let id_imagen = row.find(".id-imagen").val();
        let tipo = row.find(".tipo-imagen").val();

        ////console.log("Click en borrar imagen. Tipo:", tipo, "ID:", id_imagen);

        if (tipo === "nueva") {
            ////console.log("Mostrando alerta para imagen nueva (no guardada en BD)");
            Swal.fire({
                title: "¿Desea eliminar esta imagen?",
                text: "La imagen no se ha guardado aún en la base de datos.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                ////console.log("Resultado de Swal (nueva):", result);
                if (result.isConfirmed) {
                    row.remove();
                    ////console.log("Fila eliminada (imagen nueva).");
                } else {
                    ////console.log("Eliminación cancelada (imagen nueva).");
                }
            });
        } else {
            ////console.log("Mostrando alerta para imagen existente (guardada en BD)");
            Swal.fire({
                title: "¿Desea eliminar esta imagen?",
                text: "Esta acción eliminará la imagen de la base de datos.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                ////console.log("Resultado de Swal (existente):", result);
                if (result.isConfirmed) {
                    $.post("../Controllers/ProductoController.php", {
                        funcion: "eliminar_imagen",
                        id_imagen: id_imagen
                    }, function (response) {
                        ////console.log("Respuesta del servidor:", response);
                        if (response.trim() === "success") {
                            Swal.fire({
                                title: "Eliminada",
                                text: "La imagen ha sido eliminada.",
                                icon: "success",
                                timer: 1000,
                                showConfirmButton: false
                            }).then(() => {
                                row.remove();
                                ////console.log("Fila eliminada (imagen existente).");
                            });
                        } else {
                            Swal.fire("Error", "No se pudo eliminar la imagen.", "error");
                            ////console.error("Error al eliminar imagen en el servidor.");
                        }
                    });
                } else {
                    ////console.log("Eliminación cancelada (imagen existente).");
                }
            });
        }
    });

    // Eliminar Producto
    $(document).on("click", ".eliminar_producto", function (e) {
        e.preventDefault();
        
        let id_producto = $(this).data("id");
    
        Swal.fire({
            title: "¿Estás seguro?",
            text: "El producto será marcado como inactivo.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "../Controllers/ProductoController.php",
                    type: "POST",
                    data: {
                        funcion: "eliminar_producto",
                        id_producto: id_producto
                    },
                    dataType: "json",
                    success: function (response) {
                        if (response.mensaje) {
                            Swal.fire("Inactivado", response.mensaje, "success");
                            read_all_productos(); // Recargar la lista de productos
                        } else {
                            Swal.fire("Error", response.error, "error");
                        }
                    },
                    error: function () {
                        Swal.fire("Error", "Hubo un problema al inactivar el producto.", "error");
                    }
                });
            }
        });
    });
    
})