$(document).ready(function(){
    Loader();
    setTimeout(verificar_sesion,1000)
    //verificar_sesion();
    let sesion = null
    
    toastr.options ={
        "debug": false,
        "positionClass": "toast-bottom-full-width",
        "onclick":null,
        "fadein":300,
        "fadeOut":1000,
        "timeOut":5000,
        "extendedTimeOut":1000
    }
    //Cargar Pagina
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
                    sesion = JSON.parse(response);
                    llenar_menu_superior(sesion);
                    llenar_menu_lateral(sesion);
                    $("#usuario_menu").text(sesion.nombre);
                    read_carrito();
                    read_favoritos();
                } else {
                    llenar_menu_superior();
                    llenar_menu_lateral();
                }
                verificar_producto();
                CloseLoader();
            } catch (error) {
                console.error("Error al procesar sesión:", error);
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
                ////console.error(error);
                ////console.log(response);
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

    function mostrar_pasarela(producto) {
        let template = "";
    
        if (producto.imagenes.length > 0) {
            // Imagen principal
            template += `
                <div class="text-center mb-3">
                    <img id="imagen_principal" src="../Util/Img/carrusel/${producto.imagenes[0].nombre}" class="img-fluid rounded border" style="max-height: 400px; object-fit: contain;">
                </div>
                <div class="d-flex justify-content-center flex-wrap gap-2">
            `;
    
            // Miniaturas (incluyendo la principal)
            producto.imagenes.forEach((imagen, index) => {
                template += `
                    <button prod_img="${imagen.nombre}" class="imagen_pasarelas product-image-thumb btn p-1 border bg-white ${index === 0 ? 'active' : ''}">
                        <img src="../Util/Img/carrusel/${imagen.nombre}" class="rounded" style="width: 75px; height: 75px; object-fit: cover;">
                    </button>
                `;
            });
    
            template += `</div>`;
        } else {
            // Imagen por defecto
            template += `
                <div class="text-center mb-3">
                    <img id="imagen_principal" src="../Util/Img/productos/${producto.imagen}" class="img-fluid rounded border" style="max-height: 400px; object-fit: contain;">
                </div>
            `;
        }
    
        $("#loader_3").hide(500);
        $("#imagenes").html(template);
    }       
    
    async function mostrar_titulo_favorito() {
        let funcion = "mostrar_titulo_favorito";
        let data = await fetch("../Controllers/FavoritoController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "funcion=" + funcion
        });
    
        if (data.ok) {
            let response = await data.text();
            try {
                let producto = JSON.parse(response);
                let template = `
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <h3 class="mb-0 me-2">${producto.producto}</h3>
                        ${
                            producto.usuario_sesion !== "" ? `
                                <button type="button" 
                                    id_favorito="${producto.id_favorito}" 
                                    estado_favorito="${producto.estado_favorito}" 
                                    class="btn btn-outline-light p-1 bandera_favorito"
                                    style="border: none;">
                                    ${producto.estado_favorito === "A" ? 
                                        `<i class="fas fa-heart fa-lg text-danger"></i>` : 
                                        `<i class="far fa-heart fa-lg text-danger"></i>`}
                                </button>` : ""
                        }
                    </div>
                `;
                $("#producto").html(template);
            } catch (error) {
                //console.error(error);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de código: " + data.status,
            });
        }
    }   

    function mostrar_agregar_carrito(stock, precio, id_producto) {
        let template = '';
    
        if (stock === 0) {
            template = `
                <p class="fw-bold text-danger mb-2">Sin stock disponible</p>
                <button class="btn btn-secondary btn-agregar mt-3" disabled>
                  <i class="fas fa-cart-plus me-2"></i> Añadir al carrito
                </button>

            `;
        } else {
            template = `
                <p class="fw-bold text-success mb-2">Stock disponible: ${stock}</p>
                <div class="input-group mb-3" style="max-width: 160px;">
                  <button class="btn btn-danger btn-sm" id="btn_restar">-</button>
                  <input type="number" id="cantidad_producto" class="form-control text-center" min="1" max="${stock}" value="1" readonly>
                  <button class="btn btn-primary btn-sm" id="btn_sumar">+</button>
                </div>
                <p class="mb-3">Total: <span class="fw-bold text-primary">$<span id="total_producto">${parseFloat(precio).toFixed(2)}</span></span></p>
                <button class="btn btn-success btn-agregar mt-3" id="btn_agregar_carrito" data-id="${id_producto}">
                    <i class="fas fa-cart-plus fa-lg mr-2"></i> Añadir al carrito
                </button>

 `;
        }
    
        $("#agregar_carrito").html(template);
    
        // Si hay stock, habilitar la lógica de botones
        if (stock > 0) {
            $("#btn_sumar").on("click", function () {
                let cantidad = parseInt($("#cantidad_producto").val());
                if (cantidad < stock) {
                    $("#cantidad_producto").val(cantidad + 1);
                    $("#total_producto").text(((cantidad + 1) * precio).toFixed(2));
                }
            });
    
            $("#btn_restar").on("click", function () {
                let cantidad = parseInt($("#cantidad_producto").val());
                if (cantidad > 1) {
                    $("#cantidad_producto").val(cantidad - 1);
                    $("#total_producto").text(((cantidad - 1) * precio).toFixed(2));
                }
            });
        }
    }    
          
    async function verificar_producto() {
    let funcion = "verificar_producto";
    let data = await fetch("../Controllers/ProductoTiendaController.php", {
        method:"POST",
        headers:{"Content-Type":"application/x-www-form-urlencoded"},
        body: "funcion=" + funcion
    });
    if (data.ok) {
        let response = await data.text();
        try {
            let producto = JSON.parse(response);
            // Rellena el contenido de la descripción, categoría, precio, etc.
            mostrar_pasarela(producto);
            mostrar_titulo_favorito();
            $("#categoria").html("Categoría: " + producto.categoria);
            $("#precio").html(producto.precio);
            $("#product-desc").text(producto.descripcion);
            // Pasa stock, precio e id del producto a la función
            mostrar_agregar_carrito(producto.stock, producto.precio, producto.id);
        } catch (error) {
            //console.error(error);
            //console.log(response);
            if (response == "error") {
                location.href = "../Index.php";
            }
        }
    } else {
        Swal.fire({
            icon: "error",
            title: data.statusText,
            text: "Hubo conflicto de código: " + data.status,
        });
    }
    }
    
    $(document).on("click",".imagen_pasarelas",(e)=>{
        let elemento = $(this)[0].activeElement;
        let img = $(elemento).attr("prod_img");
        $("#imagen_principal").attr("src","../Util/Img/carrusel/" + img)

    })
    
    async function cambiar_estado_favorito(id_favorito, estado_favorito) {
        funcion="cambiar_estado_favorito";
        let data = await fetch("../Controllers/FavoritoController.php",{
            method:"POST",
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body: "funcion=" + funcion + "&&id_favorito=" + id_favorito + "&&estado_favorito=" + estado_favorito

        })
        if (data.ok) {
            let response = await data.text();
            ////console.log(response)
            try {
                let respuesta = JSON.parse(response)
                ////console.log(respuesta.mensaje)
                if (respuesta.mensaje=="add") {
                    toastr.success("Se agrego a favoritos")
                } else if(respuesta.mensaje=="remove") {
                    toastr.warning("Se removio de favoritos")
                }else if(respuesta.mensaje=="error al eliminar"){
                    toastr.error("No intente vulnerar el sistema")
                }
                mostrar_titulo_favorito();
                read_favoritos();

            }catch (error) {
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

    $(document).on("click",".bandera_favorito",(e)=>{
        let elemento = $(this)[0].activeElement;
        let id_favorito = $(elemento).attr("id_favorito");
        let estado_favorito = $(elemento).attr("estado_favorito");
        cambiar_estado_favorito(id_favorito, estado_favorito);
    })

    $(document).on("click", "#btn_agregar_carrito", async function () {
        if (!sesion) {
            Swal.fire({
                title: "Iniciar sesión",
                text: "Para agregar productos al carrito, primero debe iniciar sesión.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Iniciar sesión",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "login.php";
                }
            });
            return;
        }

    const id_producto = $(this).data("id");
    const stock       = parseInt($(this).data("stock"), 10);
    const cantidad    = parseInt($("#cantidad_producto").val(), 10);

    if (cantidad <= 0 || isNaN(cantidad)) {
        Swal.fire({
            icon:  "warning",
            title: "Cantidad inválida",
            text:  "Debe agregar al menos un producto al carrito.",
        });
        return;
    }

    // 1) Consultar cuántos ya hay en el carrito
    const paramsConsulta = new URLSearchParams({
        funcion:      "consultar_cantidad",
        id_producto:  id_producto
    });
    const respConsulta = await fetch("../Controllers/CarritoController.php", {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    paramsConsulta.toString()
    });
    const { cantidad_actual } = await respConsulta.json();

    // 2) Validaciones de stock
    if (cantidad_actual >= stock) {
        return Swal.fire({
            icon:  "warning",
            title: "Límite de stock",
            text:  "Ya tienes el máximo stock de este producto en el carrito."
        });
    }
    if (cantidad_actual + cantidad > stock) {
        const restante = stock - cantidad_actual;
        return Swal.fire({
            icon:  "warning",
            title: "Stock insuficiente",
            text:  `Solo puedes agregar ${restante} unidad${restante > 1 ? 'es' : ''} más.`
        });
    }

    // 3) Agregar al carrito
    const data = new URLSearchParams({
        funcion:     "agregar_al_carrito",
        id_producto: id_producto,
        cantidad:    cantidad
    });
    const resp = await fetch("../Controllers/CarritoController.php", {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    data.toString()
    });
    const result = await resp.json();
    //console.log(result);  // para depurar

    // ← Aquí reemplazamos el if/else por el switch:
    switch (result.mensaje) {
        case 'success':
            Swal.fire({
                icon:  'success',
                title: 'Producto agregado',
                text:  'El producto ha sido añadido al carrito.',
            });
            read_carrito();
            break;
    
        case 'max_stock':
            const max = result.max_disponible;
            const texto = max > 0
                ? `Solo puedes agregar ${max} unidad${max !== 1 ? 'es' : ''} más.`
                : 'Has alcanzado el stock máximo de este producto en tu carrito. No puedes agregar más.';
            Swal.fire({
                icon:  'warning',
                title: 'Stock insuficiente',
                text:  texto,
            });
            break;
    
        default:
            Swal.fire({
                icon:  'error',
                title: 'Error al agregar al carrito',
            });
    }
    
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

    // Modificar perfil
    function obtener_datos() {
        $.post('../Controllers/UsuarioController.php', {funcion: 'obtener_datos'}, (response) => {
            try {
                let usuario = JSON.parse(response);
                
                $('#nombre_mod').val(usuario.nombre);
                $('#apellido_mod').val(usuario.apellido);
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
            let telefono = $("#telefono_mod").val();
            $.post("../Controllers/UsuarioController.php",{funcion,nombre,apellido,telefono},(response)=>{
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
})