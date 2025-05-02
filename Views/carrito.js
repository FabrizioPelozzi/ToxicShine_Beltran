$(document).ready(function(){

    Loader();
    // setTimeout(verificar_sesion,2000);
    verificar_sesion();

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
                        window.location.href = "../Views/login.php";
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
      
    async function read_all_carrito() {
        const funcion = "leer_carrito";
        let data = await fetch("../Controllers/CarritoController.php", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "funcion=" + funcion
        });
        
        if (data.ok) {
            let carrito = await data.json();  // Objeto JSON
            try {
                let cartItems = [];
                let grandTotal = 0;
                
                if (carrito.length === 0) {
                    $("#carrito").html(`
                        <div class="card text-center shadow-sm p-3 mb-3 bg-white rounded">
                            <div class="card-body">
                                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                                <p class="card-text">¡Agrega productos para comenzar tu compra!</p>
                                <a href="../index.php" class="btn btn-primary">Ver productos</a>
                            </div>
                        </div>
                    `);
                    $("#total_grand").html("");
                    return;
                }
                
                carrito.forEach(item => {
                    let precio = parseFloat(item.precio);
                    let cantidad = parseInt(item.cantidad);
                    let totalProducto = precio * cantidad;
                    grandTotal += totalProducto;
                    
                    let template = `
                        <div class="card card-widget widget-user-2">
                            <div class="widget-user-header bg-info">
                                <div class="widget-user-image">
                                    <img class="img-circle elevation-2" src="../Util/Img/productos/${item.imagen}" alt="${item.titulo}">
                                </div>
                                <h4 class="widget-user-username">${item.titulo}</h4>
                                <h5 class="widget-user-desc">Categoría: ${item.categoria}</h5>
                            </div>
                            <div class="card-body">
                                <p>${item.descripcion}</p>
                                <p>Precio unitario: $${precio.toFixed(2)}</p>
                                <div class="d-flex align-items-center mb-2">
                                    <button class="btn btn-danger btn-sm btn-decrementar" data-id="${item.id}">−</button>
                                    <input type="number" class="form-control input-cantidad ml-2 mr-2" value="${cantidad}" min="1" max="${item.stock}" style="width: 60px; text-align: center;" data-id="${item.id}">
                                    <button class="btn btn-primary btn-sm btn-incrementar" data-id="${item.id}">+</button>
                                </div>
                                <p>Total: $<span class="item-total">${totalProducto.toFixed(2)}</span></p>
                                <div class="text-right">
                                    <button class="btn btn-warning btn-sm actualizar_stock" data-id="${item.id}">
                                        <i class="fas fa-sync"></i> Actualizar stock
                                    </button>
                                    <button class="btn btn-danger btn-sm eliminar_carrito" data-id="${item.id}">
                                        <i class="fas fa-trash-alt"></i> Eliminar
                                    </button>
                                    <a href="../Views/descripcion.php?name=${encodeURIComponent(item.titulo)}&&id=${encodeURIComponent(item.id_producto)}" class="btn btn-info btn-sm">
                                        <i class="fas fa-eye"></i> Ver producto
                                    </a>
                                </div>
                            </div>
                        </div>`;
                    cartItems.push({ celda: template });
                });
                
                if ($.fn.DataTable.isDataTable("#carrito")) {
                    $("#carrito").DataTable().clear().destroy();
                }
                $("#carrito").empty();
                
                $("#carrito").DataTable({
                    data: cartItems,
                    aaSorting: [],
                    searching: true,
                    scrollX: true,
                    autoWidth: false,
                    responsive: true,
                    columns: [
                        { data: "celda" }
                    ],
                    destroy: true,
                    language: espanol,
                    drawCallback: function () {
                        $("#total_grand").html(`<button class="btn btn-success" id="finalizar_carrito">Finalizar Carrito</button>`);
                    }
                });
                
            } catch (error) {
                console.error("Error al procesar el JSON:", error);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de código: " + data.status,
            });
        }
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
                        verificar_sesion();
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

    // Carrito  
    
    // Función que calcula y actualiza el total de UN ítem
    function actualizarTotalItem(id) {
    // 1.1 elemento input y cantidad
    const $input   = $(`input.input-cantidad[data-id="${id}"]`);
    const cantidad = parseInt($input.val(), 10);

    // 1.2 buscar el <p> que contiene "Precio unitario" y extraer número
    const textoPrecio = $input
        .closest('.card-body')
        .find('p')
        .filter((i, el) => el.textContent.includes('Precio unitario'))
        .text();
    const precio = parseFloat(textoPrecio.replace(/[^0-9.]/g, ''));

    // 1.3 calcular nuevo total y volcarlo
    const totalItem = cantidad * precio;
    $input
        .closest('.card-body')
        .find('.item-total')
        .text(totalItem.toFixed(2));

    // 1.4 recalcular total general
    //actualizarTotalGeneral();

    // 1.5 (Opcional) sincronizar con servidor
    $.post(
        "../Controllers/CarritoController.php",
        { funcion: "actualizar_cantidad", id, cantidad },
        function(response) {
            // aquí podrías manejar errores, p.ej.:
            // if (response.trim() !== "success") console.error("No se actualizó la cantidad en servidor");
        }
    );
    }
    
    // Función que recorre todos los .item-total y suma el gran total
    // function actualizarTotalGeneral() {
    // let granTotal = 0;
    // $('.item-total').each(function() {
    //     granTotal += parseFloat($(this).text());
    // });
    // // Volcar total + botón Finalizar
    // $('#total_grand').html(`
    //     <div class="d-flex justify-content-between align-items-center">
    //         <span class="h4">Total carrito: $${granTotal.toFixed(2)}</span>
    //         <button class="btn btn-success" id="finalizar_carrito">Finalizar Carrito</button>
    //     </div>
    // `);
    // }

    // Delegar evento para incrementar cantidad
    $(document).on("click", ".btn-incrementar", function () {
        let id = $(this).data("id");
        let input = $(`input.input-cantidad[data-id="${id}"]`);
        let cantidad = parseInt(input.val());
        let max = parseInt(input.attr("max"));
        if (cantidad < max) {
            input.val(cantidad + 1);
            actualizarTotalItem(id);
        }
    });
    
    // Delegar evento para decrementar cantidad
    $(document).on("click", ".btn-decrementar", function () {
        let id = $(this).data("id");
        let input = $(`input.input-cantidad[data-id="${id}"]`);
        let cantidad = parseInt(input.val());
        if (cantidad > 1) {
            input.val(cantidad - 1);
            actualizarTotalItem(id);
        }
    });

    // Evento para actualizar la cantidad del producto en el carrito
    $(document).on("click", ".actualizar_stock", async function () {
        let id = $(this).data("id");
        let inputCantidad = $(`input.input-cantidad[data-id="${id}"]`);
        let cantidad = parseInt(inputCantidad.val());
        
        let dataParams = new URLSearchParams();
        dataParams.append("funcion", "actualizar_cantidad");
        dataParams.append("id", id);
        dataParams.append("cantidad", cantidad);
        
        let response = await fetch("../Controllers/CarritoController.php", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: dataParams.toString()
        });
        
        if (response.ok) {
            const result = await response.text();
            Swal.fire({
                icon: "success",
                title: "Stock actualizado",
                text: "La cantidad fue modificada correctamente"
            });
            read_all_carrito();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error al actualizar",
                text: "Intenta nuevamente"
            });
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

        console.log("Total enviado al servidor:", total); // 👈 Consola para verificar
    
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
    
            const data = await response.json();
            console.log("Respuesta de crear_preferencia.php:", data);
    
            if (data.error) {
                Swal.fire("Error", data.error, "error");
                return;
            }
    
            // Redirigir al pago
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
