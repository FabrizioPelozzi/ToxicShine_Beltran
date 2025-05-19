$(document).ready(function() {
    Loader();
    //setTimeout(verificar_sesion,1000);
    verificar_sesion();

    // Listeners del filtro
    $('#filtro_nombre')
        .on('input', filtrar_productos);
    $('#filtro_precio_min, #filtro_precio_max')
        .on('input', filtrar_productos);
    $('#filtro_categoria, #filtro_stock')
        .on('change', filtrar_productos);

    //Cargar Pagina
    async function verificar_sesion() {
        funcion = "verificar_sesion";
        let data = await fetch("../Controllers/UsuarioController.php",{
            method:"POST",
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body: "funcion=" +funcion

        })
        if (data.ok) {
            let response = await data.text();
            //console.log(response);
            
            try {
                if (response !="") {
                    let sesion =JSON.parse(response);
                    ////console.log(sesion);
                    llenar_menu_superior(sesion);
                    llenar_menu_lateral(sesion);
                    $("#active_nav_todos_productos").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_carrito();
                    read_favoritos();
                }
                else{
                    llenar_menu_superior();
                    llenar_menu_lateral();
                }
                llenar_select_categorias()
                filtrar_productos();
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
    
    // Llena el selec de categorias activas
    function llenar_select_categorias() {
        $.post('../Controllers/CategoriaController.php',
          { funcion: 'llenar_categorias' },
          response => {
            const cats = JSON.parse(response);
            let tpl = `<option value="">Todas</option>`;
            cats.forEach(c => tpl += `<option value="${c.id_categoria}">${c.nombre_categoria}</option>`);
            $('#filtro_categoria').html(tpl);
          }
        );
    }
        
    // Filtrar productos
    async function filtrar_productos() {
        const params = new URLSearchParams({
          funcion: 'llenar_productos',
          nombre: $('#filtro_nombre').val(),
          categoria: $('#filtro_categoria').val(),
          stock: $('#filtro_stock').val(),
          precio_min: $('#filtro_precio_min').val(),
          precio_max: $('#filtro_precio_max').val()
        });
      
        // $('#loader_3').show();
        $('#productos').empty();
      
        try {
          const res = await fetch('../Controllers/ProductoTiendaController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
          });
          const text = await res.text();
      
          let productos = [];
          if (text.trim() !== '') {
            try {
              productos = JSON.parse(text);
            } catch (e) {
              console.error('Error parseando JSON:', e, '\nRespuesta del servidor:', text);
              // opcional: mostrar mensaje al usuario
            }
          }
      
          // Montar plantilla con el array
          let tpl = '';
            if (productos.length === 0) {
              // Mensaje cuando no hay resultados
              tpl = `
                <div class="col-12">
                  <p class="text-center text-muted mt-4">
                    No se encontraron productos que coincidan con esos filtros.
                  </p>
                </div>`;
            } else {
          productos.forEach(p => {
            tpl += `
              <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <div class="card-wrapper">
                <div class="card mb-3">
                  <a href="descripcion.php?name=${p.producto}&id=${p.id}">
                    <img src="../Util/Img/productos/${p.imagen}"
                         class="card-img-top img-fluid"
                         alt="${p.producto}">
                  </a>
                  <div class="card-body">
                    <h6 class="text-muted mb-1">${p.categoria}</h6>
                    <h5 class="card-title">
                      <a href="descripcion.php?name=${p.producto}&id=${p.id}"
                         class="titulo_producto stretched-link">
                        ${p.producto}
                      </a>
                    </h5>
                    <div class="d-flex justify-content-between align-items-center mt-2 w-100">
                      <span>$ ${p.precio}</span>
                      ${parseInt(p.stock) === 0
                        ? '<span class="badge badge-danger">Sin stock</span>'
                        : ''
                      }
                    </div>
                  </div>
                </div>
              </div>
              </div>`;
          });
        }
      
          $('#loader_3').hide();
          $('#productos').html(tpl);
      
        } catch (err) {
          console.error('Fetch error:', err);
        }
    }
});