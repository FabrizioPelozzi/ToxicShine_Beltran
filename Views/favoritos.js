$(document).ready(function(){
    Loader();
    setTimeout(verificar_sesion,1000);
    //verificar_sesion();

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
                    $("#active_nav_favoritos").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito();
                    read_all_favoritos();
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

    async function read_all_favoritos() {
        let funcion = "read_all_favoritos";
        let data = await fetch("../Controllers/FavoritoController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "funcion=" + funcion
        });
    
        if (data.ok) {
            let response = await data.text();
            try {
                let favoritos = JSON.parse(response);
                let favorites = [];
    
                if (favoritos.length === 0) {
                    $("#fav").html(`
                        <div class="card text-center shadow-sm p-3 mb-3 bg-white rounded">
                            <div class="card-body">
                                <i class="far fa-heart fa-3x text-muted mb-3"></i>
                                <p class="card-text">¡Todavía no tenés productos en tus favoritos!</p>
                                <a href="../index.php" class="btn btn-primary">Explorar productos</a>
                            </div>
                        </div>
                    `);
                    return;
                }
    
                favoritos.forEach(favorito => {
                    let template = `
                        <div class="card card-widget widget-user-2">
                            <div class="widget-user-header" style="background-color: #ffe066; color: #333;">
                                <div class="widget-user-image">
                                    <img class="img-circle elevation-2" src="../Util/Img/productos/${favorito.imagen}" alt="${favorito.titulo}">
                                </div>
                                <h4 class="widget-user-username">${favorito.titulo}</h4>
                                <h5 class="widget-user-desc">Categoría: ${favorito.categoria}</h5>
                            </div>
                            <div class="card-body">
                                <p>${favorito.descripcion}</p>
                                <p>Precio: $${parseFloat(favorito.precio).toFixed(2)}</p>
                                <div class="text-right">
                                    <a href="../${favorito.url}" class="btn btn-info btn-sm">
                                        <i class="fas fa-eye"></i> Ver producto
                                    </a>
                                    <button type="button" class="btn btn-danger btn-sm eliminar_fav" attrid="${favorito.id}">
                                        <i class="far fa-trash-alt"></i> Quitar favorito
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    favorites.push({ celda: template });
                });
    
                if ($.fn.DataTable.isDataTable("#fav")) {
                    $("#fav").DataTable().clear().destroy();
                }
                $("#fav").empty();
    
                $("#fav").DataTable({
                    data: favorites,
                    aaSorting: [],
                    searching: true,
                    scrollX: true,
                    autoWidth: false,
                    responsive: true,
                    columns: [{ data: "celda" }],
                    destroy: true,
                    language: espanol
                });
    
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

    // Gestionar Favoritos
    async function eliminar_favorito(id_favorito) {
        funcion="eliminar_favorito";
        let data = await fetch("../Controllers/FavoritoController.php",{
            method:"POST",
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body: "funcion=" + funcion + "&&id_favorito=" + id_favorito

        })
        if (data.ok) {
            let response = await data.text();
            ////console.log(response)
            try {
                let respuesta = JSON.parse(response)
                ////console.log(respuesta.mensaje)
                if (respuesta.mensaje=="favorito eliminado") {
                    toastr.success("el preoducto se elimino de tus favoritos")
                } else if(respuesta.mensaje=="error al eliminar") {
                    toastr.warning("No intente vulnerar el sistema")
                }
                read_all_favoritos();
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

    $(document).on("click",".eliminar_fav",(e)=>{
        let elemento = $(this)[0].activeElement;
        let id = $(elemento).attr("attrid");
        ////console.log(id);
        eliminar_favorito(id);
        //eliminar_favorito(id_favorito, estado_favorito);
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
                verificar_producto();
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
})