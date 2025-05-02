$(document).ready(function(){

    Loader();
    //setTimeout(verificar_sesion,2000);
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
                    $("#active_nav_categorias").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito()
                    read_all_categorias();
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

    async function read_all_categorias() {
        const funcion = "read_all_categorias";
        let data = await fetch("../Controllers/CategoriaController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "funcion=" + funcion
        });
        
        if (data.ok) {
            let response = await data.text();
            try {
                let categorias = JSON.parse(response);
                
                $("#categoria").DataTable({
                    data: categorias,
                    "aaSorting": [],
                    "searching": true,
                    "scrollX": true,
                    "autoWidth": false,
                    "responsive": true,
                    columns: [
                        { data: "nombre_categoria" },
                        {
                            "render": function (data, type, dato, meta) {
                                return `<button id_categoria="${dato.id_categoria}" nombre_categoria="${dato.nombre_categoria}" class="edit btn btn-info" title="Editar categoria" type="button" data-bs-toggle="modal" data-bs-target="#modal_editar_categoria">
                                            <i class="fas fa-pencil-alt"></i>
                                        </button>
                                        <button id_categoria_mod="${dato.id_categoria}" class="remove btn btn-danger" title="Eliminar categoria">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>`;
                            }
                        }
                    ],
                    "destroy": true,
                    "language": espanol
                });
    
                $(document).on("click", ".edit", function () {
                    const id_categoria = $(this).attr("id_categoria");
                    const nombre_categoria = $(this).attr("nombre_categoria");
                    $("#modal_editar_categoria #id_categoria_mod").val(id_categoria);
                    $("#modal_editar_categoria #nombre_categoria_mod").val(nombre_categoria);
                    $("#nombre_categoria").val(nombre_categoria);
                });
                    //console.log("Valor en el campo id_categoria_mod:", $("#id_categoria_mod").val());
                    //console.log("Valor en el campo nombre_categoria:", $("#nombre_categoria_mod").val());
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
                //////console.error("No se encontró ID para el producto:", data);
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

    // AMB Categoria
    // Crear Categoria
    $.validator.setDefaults({
        submitHandler: function () {
            let funcion="crear_categoria";
            let nombre_categoria = $("#nombre_categoria").val();
            $.post("../Controllers/CategoriaController.php",{funcion,nombre_categoria},(response)=>{
                response = $.trim(response);
                //console.log(">>> respuesta cruda:", JSON.stringify(response));
                if (response == "success") {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Se ha creado la nueva categoría",
                        showConfirmButton: false,
                        timer: 1000
                    }).then(function(){
                        $('#modal_crear_categoria').modal('hide');
                        verificar_sesion();
                    });
                } else if (response == "reactivada") {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Categoría reactivada correctamente",
                        showConfirmButton: false,
                        timer: 1000
                    }).then(function(){
                        $('#modal_crear_categoria').modal('hide');
                        verificar_sesion();
                    });
                } else if (response == "categoria_existente") {
                    Swal.fire({
                        icon: "warning",
                        title: "Duplicado",
                        text: "Ya existe una categoría activa con ese nombre",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo conflicto al agregar la categoría",
                    });
                }                
            })
        }
    });

    $('#form-categoria').validate({
        rules: {
            nombre_categoria: {
                required: true,
            },
        },
        messages: {
            nombre_categoria: {
                required: "Ingrese un nombre",
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
            $(element).removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
            $(element).addClass('is-valid');
        }
    });

    // Editar Categoria
    $.validator.setDefaults({
        submitHandler: function () {
            let funcion = "editar_categoria";
            let id_categoria = $("#id_categoria_mod").val(); 
            let nombre_categoria_mod = $("#nombre_categoria_mod").val();  
            ////console.log("Enviando nombre_categoria_mod: " + nombre_categoria_mod);
            $.post("../Controllers/CategoriaController.php", {funcion, id_categoria, nombre_categoria_mod}, (response) => {
                ////console.log(response)
                if (response == "success") {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Se han editado sus datos",
                        showConfirmButton: false,
                        timer: 1000
                    }).then(function () {
                        $('#modal_editar_categoria').modal('hide');
                        verificar_sesion();
                    });
                } else if (response == "categoria_existente") {
                    Swal.fire({
                        icon: "warning",
                        title: "Duplicado",
                        text: "Ya existe una categoría con ese nombre",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo conflicto al editar la categoría",
                    });
                }
            });
        }
    });

    $('#form-editar-categoria').validate({
        rules: {
            nombre_categoria_mod: {
                required: true,
            },
        },
        messages: {
            nombre_categoria_mod: {
                required: "Ingrese un nombre",
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
            $(element).removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
            $(element).addClass('is-valid');
        }
    });

    // Eliminar Categoria
    $(document).on("click", ".remove", function () {
        const id_categoria = $(this).attr("id_categoria_mod");
        ////console.log("ID Categoría enviada:", id_categoria);

        Swal.fire({
            title: "¿Desea desactivar la categoría?",
            text: "Podrá reactivar la categoría desde la base de datos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Inactivar"
        }).then((result) => {
            if (result.isConfirmed) {
                $.post("../Controllers/CategoriaController.php", { 
                    funcion: "eliminar_categoria", 
                    id_categoria: id_categoria 
                }, function(response) {
                    ////console.log("Respuesta:", response);
                    if (response.trim() === "success") {
                        Swal.fire({
                            title: "Inactivada",
                            text: "Categoría inactiva",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1000
                        }).then(function () {
                            read_all_categorias();
                        });
                    } else if(response.trim() === "error_existen_productos") {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "No se puede borrar la categoría. Existen productos activos asociados.",
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un problema al inactivar la categoría.",
                        });
                    }
                });
            }
        });
    });
})
