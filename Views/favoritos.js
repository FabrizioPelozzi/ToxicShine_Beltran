$(document).ready(function(){
    Loader();
    //setTimeout(verificar_sesion,1000);
    verificar_sesion();

    let allFavoritos = [];
    let searchFavoritos = "";

    // Buscar favoritos
    $('#buscar_favoritos').on('input', function () {
        searchFavoritos = $(this).val().trim().toLowerCase();
        renderizar_favoritos(filtrar_favoritos());
    });

    // Filtrar favoritos en el buscador
    function filtrar_favoritos() {
      if (!searchFavoritos) return allFavoritos;
      return allFavoritos.filter(item =>
        item.titulo.toLowerCase().includes(searchFavoritos)
      );
    }

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

    // Cargar favoritos
    async function read_all_favoritos() {
      let funcion = "read_all_favoritos";
      let data = await fetch("../Controllers/FavoritoController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion
      });

      if (!data.ok) {
        return Swal.fire({
          icon: "error",
          title: data.statusText,
          text: "Hubo conflicto de código: " + data.status,
        });
      }

      let response = await data.text();
      try {
        let favoritos = JSON.parse(response);
        allFavoritos = favoritos;
        renderizar_favoritos(filtrar_favoritos());
      } catch (error) {
        console.error("Error al parsear JSON:", error);
      }
    }

    // Renderizar tabla con favoritos
    function renderizar_favoritos(lista) {
      const $f = $("#fav");
      $f.empty();

      if (!lista.length) {
        return $f.html(`
          <div class="col-12 d-flex justify-content-center">
            <div class="card text-center shadow-sm p-3 mb-3 bg-white rounded" style="max-width: 400px;">
              <div class="card-body">
                <i class="far fa-heart fa-3x text-muted mb-3"></i>
                <p class="card-text">¡Todavía no tenés productos en tus favoritos!</p>
                <a href="index.php" class="btn btn-primary">Explorar productos</a>
              </div>
            </div>
          </div>
        `);
      }

      lista.forEach(item => {
        const card = `
          <div class="col-12 col-md-6 mb-4">
            <div class="card favorito-item h-100">
              <div class="card-header">
                <h5>${item.titulo}</h5>
              </div>
              <div class="card-body">
                <div class="favorito-info">
                  <p class="descripcion-limitada">${item.descripcion}</p>
                  <p><strong>Categoría:</strong> ${item.categoria}</p>
                  <p><strong>Precio:</strong> $${parseFloat(item.precio).toFixed(2)}</p>
                </div>
                <img src="../Util/Img/productos/${item.imagen}" alt="${item.titulo}" class="favorito-img">
              </div>
              <div class="card-footer">
                  <a href="../${item.url}" class="btn btn-info btn-sm">
                    <i class="fas fa-eye"></i> Ver producto
                  </a>
                  <button class="btn btn-danger btn-sm eliminar_fav" attrid="${item.id}">
                    <i class="far fa-trash-alt"></i> Quitar favorito
                  </button>
                </div>
            </div>
          </div>
        `;
        $f.append(card);
      });
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

    // Eliminar favorito
    $(document).on("click",".eliminar_fav",(e)=>{
        let elemento = $(this)[0].activeElement;
        let id = $(elemento).attr("attrid");
        ////console.log(id);
        eliminar_favorito(id);
        //eliminar_favorito(id_favorito, estado_favorito);
    })

    // Cambiar estado de favorito
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