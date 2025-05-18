$(document).ready(function(){
    Loader();
    setTimeout(verificar_sesion,1000)
    //verificar_sesion();
    let sesion = null
    
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

    // Cargar pasarela de imagenes
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
    
    // Cargar Titulo Favorito
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

    // Cargar Agregar Carrito
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
    
        // Lógica de botones
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
    
    // Cargar Producto
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
    
    // Cambiar Imagen en la pasarela
    $(document).on("click",".imagen_pasarelas",(e)=>{
        let elemento = $(this)[0].activeElement;
        let img = $(elemento).attr("prod_img");
        $("#imagen_principal").attr("src","../Util/Img/carrusel/" + img)

    })
    
    // Cambiar estado de favorito del producto
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

    // Cambiar estado de favorito del producto
    $(document).on("click",".bandera_favorito",(e)=>{
        let elemento = $(this)[0].activeElement;
        let id_favorito = $(elemento).attr("id_favorito");
        let estado_favorito = $(elemento).attr("estado_favorito");
        cambiar_estado_favorito(id_favorito, estado_favorito);
    })

    // Agregar producto al carrito
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
    //console.log(result);

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
})