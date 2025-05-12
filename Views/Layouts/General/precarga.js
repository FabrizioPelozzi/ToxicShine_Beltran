// Menu superior y lateral
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

    // Botón accesible para todos los usuarios
    template += `
        <li class="nav-header">Explorar</li>
        <li id="nav_todos_productos" class="nav-item">
            <a id="active_nav_todos_productos" href="../Views/index.php" class="nav-link">
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
                <li id="nav_pedidos" class="nav-item">
                    <a id="active_nav_pedidos" href="../Views/Pedidos.php" class="nav-link">
                        <i class="fas fa-shopping-bag nav-icon"></i>
                        <p id="nav_cont_pedidos">Pedidos</p>
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
                <li id="nav_adminpedidos" class="nav-item">
                    <a id="active_nav_adminpedidos" href="../Views/pedidosadmin.php" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-clipboard"></i>
                        <p id="nav_cont_adminpedidos">Administrar Pedidos</p>
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
}

toastr.options ={
    "debug": false,
    "positionClass": "toast-bottom-full-width",
    "onclick":null,
    "fadein":300,
    "fadeOut":1000,
    "timeOut":5000,
    "extendedTimeOut":1000
}

//Configurar perfil
function obtener_datos() {
    $.post('../Controllers/UsuarioController.php', {funcion: 'obtener_datos'}, (response) => {
        try {
            let usuario = JSON.parse(response);
            $('#nombre_mod').val(usuario.nombre);
            $('#apellido_mod').val(usuario.apellido);
            $('#dni_mod').val(usuario.dni);
            $('#telefono_mod').val(usuario.telefono);
            
        } catch (error) {
            //console.error('Error al parsear la respuesta:', error)
        }
    });
}

$(document).on('click', '#abrirModalPerfil', (e) => {
    e.preventDefault();
    obtener_datos();
    $('#modal_datos').modal('show');
});

$.validator.setDefaults({
    submitHandler: function () {
        funcion="editar_datos";
        let nombre = $("#nombre_mod").val();
        let apellido = $("#apellido_mod").val();
        let dni = $("#dni_mod").val();
        let telefono = $("#telefono_mod").val();
        $.post("../Controllers/UsuarioController.php",{funcion,nombre,apellido,dni,telefono},(response)=>{
            if (response == "success") {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Se han editado sus datos",
                    showConfirmButton: false,
                    timer: 1000
                }).then(function(){
                    $('#modal_datos').modal('hide');
                    obtener_datos();
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: data.statusText,
                    text: "Hubo conflicto al editar sus datos",
                })
            }
        })
    }
});

jQuery.validator.addMethod("letras",
    function(value, element) {
        return /^[A-Za-z\s]+$/.test(value);
    },
    "*Este campo solo permite letras"
);

$('#form-datos').validate({
    rules: {
        nombre_mod: {
            required: true,
            letras: true
        },
        apellido_mod: {
            required: true,
            letras: true
        },
        dni_mod: {
            required: true,
            digits: true,
            minlength: 8,
            maxlength: 8
        },
        telefono_mod: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10
        },
    },
    messages: {
        nombre_mod: {
            required: "Ingrese un nombre",
        },
        apellido_mod: {
            required: "Ingrese un apellido",
        },
        dni_mod: {
            required: "Ingrese un DNI",
            minlength: "Tu DNI debe ser de 8 caracteres",
            maxlength: "Tu DNI debe ser de 8 caracteres",
            digits: "El DNI solo está compuesto por números"
        },
        telefono_mod: {
            required: "Ingrese un N° de teléfono",
            minlength: "Tu N° de teléfono debe ser de 10 caracteres",
            maxlength: "Tu N° de teléfono debe ser de 10 caracteres",
            digits: "El teléfono solo debe contener números"
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

$(document).ready(function(){
    if ($.fn.dataTable) {
        $.fn.dataTable.defaults.language = espanol;
    }
});