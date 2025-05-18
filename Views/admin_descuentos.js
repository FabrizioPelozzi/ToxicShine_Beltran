$(document).ready(function(){
    Loader();
    verificar_sesion();

    // Cargar pagina
    async function verificar_sesion() {
        const funcion = "verificar_sesion";
        let data = await fetch("../Controllers/UsuarioController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "funcion=" + funcion
        });

        if (!data.ok) {
            Swal.fire("Error", data.statusText, "error");
            return;
        }

        let response = await data.text();
        try {
            if (response !== "") {
                let sesion = JSON.parse(response);

                // Validación de tipo de usuario
                if (sesion.id_tipo_usuario != 1 && sesion.id_tipo_usuario != 3) {
                    Swal.fire({
                        icon: "error",
                        title: "Acceso denegado",
                        text: "No tienes permiso para acceder a esta sección."
                    }).then(() => window.location.href = "index.php");
                    return;
                }

                // Menú y estados
                llenar_menu_superior(sesion);
                llenar_menu_lateral(sesion);
                $("#active_nav_admin_descuentos").addClass("active");
                $("#usuario_menu").text(sesion.nombre);
                read_favoritos();
                read_carrito();
                buscar_descuento_activos();
                setInterval(buscar_descuento_activos, 60 * 1000);
                
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Sesión no iniciada",
                    text: "Por favor inicia sesión para acceder."
                }).then(() => window.location.href = "login.php");
            }
        } catch (err) {
            console.error("Error en verificar_sesion:", err);
        } finally {
            CloseLoader();
        }
    }

    //  Función para cargar descuentos activos
    async function buscar_descuento_activos() {
        await fetch('../Controllers/DescuentoController.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'funcion=descuento_terminado'
        })
        // .then(r => r.json())
        // .then(json => console.log('Archive result:', json));
        const response = await fetch('../Controllers/DescuentoController.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'funcion=read_active_descuentos'
        });
        const descuentos = await response.json();
        const $tbody = $('#tabla_descuentos tbody');
        $tbody.empty();
      
          try {
            if (descuentos.length === 0) {
              const $tr = $(`
                      <tr>
                        <td colspan="8" class="text-center text-muted">
                          <div class="card text-center shadow-sm p-3 mb-3 bg-white rounded">
                            <div class="card-body">
                                <i class="fas fa-solid fa-percent fa-3x text-muted mb-3"></i>
                                <p class="card-text">No hay descuentos activos en este momento</p>
                                <p class="card-text">Si deseas revisar el historial de descuentos, presiona el boton:</p>
                                <a href="historial_descuentos.php" class="btn btn-primary">Ver historial de descuentos</a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    `);                
                  $tbody.append($tr);
                return;
            }
            const now = new Date();

          descuentos.forEach(d => {
            const tiempoRestante = calcular_tiempo_restante(d.fin);
            const precioDesc = (d.precio_orig * (1 - d.porcentaje / 100)).toFixed(2);
            const inicio = new Date(d.inicio);
            const estado = now < inicio ? 'Programado' : 'Activo';
            const rowClass = estado === 'Programado' ? 'table-warning' : 'table-success';
          
            const $tr = $(`
              <tr class="${rowClass}">
                <td>${d.producto}</td>
                <td>${d.categoria}</td>
                <td>${d.porcentaje}%</td>
                <td>${d.precio_orig}$</td>
                <td>${precioDesc}$</td>
                <td class="tiempo-restante" data-fin="${d.fin}">${tiempoRestante}</td>
                <td>${estado}</td>
                <td>
                  <button class="btn btn-sm btn-primary btn-editar" 
                          data-id="${d.id_descuento}"
                          data-producto="${d.producto}"
                          data-porcentaje="${d.porcentaje}"
                          data-inicio="${d.inicio}"
                          data-fin="${d.fin}">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger btn-eliminar" data-id="${d.id_descuento}">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `);
                $tbody.append($tr);
            });
        } catch (err) {
            console.error("Error cargando descuentos activos:", err);
        }
    }

    // Función para calcular el tiempo restante del descuento
    function calcular_tiempo_restante(fin) {
      const [fecha, hora] = fin.split(' ');
      const [year, month, day] = fecha.split('-').map(Number);
      const [hour, minute, second] = hora.split(':').map(Number);

      const fechaFin = new Date(year, month - 1, day, hour, minute, second);
      const ahora    = new Date();

      // console.log(' ahora:', ahora.toString());
      // console.log(' fechaFin:', fechaFin.toString());

      let diff = fechaFin - ahora;
      if (diff < 0) return 'expiró';

      const dias  = Math.floor(diff / 86400000); diff -= dias  * 86400000;
      const horas = Math.floor(diff / 3600000);  diff -= horas * 3600000;
      const mins  = Math.floor(diff / 60000);

      const partes = [];
      if (dias  > 0) partes.push(`${dias}d`);
      if (horas > 0) partes.push(`${horas}h`);
      if (mins  > 0) partes.push(`${mins}m`);
      return partes.join(' ') || '< 1m';
    }

    // Función para establecer el atributo 'min' de los inputs de fechas 
    function setear_fecha_minima($inicio, $fin) {
      const ahora = new Date();
      const pad2 = n => String(n).padStart(2,'0');
      const isoLocal = `${ahora.getFullYear()}-${pad2(ahora.getMonth()+1)}-${pad2(ahora.getDate())}`
                       + `T${pad2(ahora.getHours())}:${pad2(ahora.getMinutes())}`;
      $inicio.attr('min', isoLocal);
      $fin.attr('min', isoLocal);
    }

    // Abrir modal productos
    $('#btn-nuevo-producto').on('click', async () => {
      await cargar_lista_de_productos();
      const $ini = $('#inicio_prod'), $fin = $('#fin_prod');
      setear_fecha_minima($ini, $fin);
      $ini.off('change').on('change', () => {
        if ($ini.val()) $fin.attr('min', $ini.val());
      });
      $('#modal_descuento_producto').modal('show');
    });

    // Abrir modal categorías
    $('#btn-nuevo-categoria').on('click', async () => {
      await cargar_lista_de_categorias();
      const $ini = $('#inicio_cat'), $fin = $('#fin_cat');
      setear_fecha_minima($ini, $fin);
      $ini.off('change').on('change', () => {
        if ($ini.val()) $fin.attr('min', $ini.val());
      });
      $('#modal_descuento_categoria').modal('show');
    });

    // Llenar lista de categorías con checkboxes
    async function cargar_lista_de_categorias() {
      const categorias = await fetch('../Controllers/CategoriaController.php', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: 'funcion=read_all_categorias'
      }).then(r => r.json());

      const $lista = $('#lista_categorias');
      $lista.empty();
      categorias.forEach(c => {
        const $chk = $(`
          <div class="form-check">
            <input class="form-check-input"
                   type="checkbox"
                   name="id_categoria[]"
                   value="${c.id_categoria}"
                   id="cat_${c.id_categoria}">
            <label class="form-check-label" for="cat_${c.id_categoria}">
              ${c.nombre_categoria}
            </label>
          </div>
        `);
        $lista.append($chk);
      });
    }    

    // Llenar lista de productos con checkboxes
    async function cargar_lista_de_productos() {
      const productos = await fetch('../Controllers/ProductoController.php', {
        method:'POST',
        headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
        body: 'funcion=read_all_productos'
      }).then(r => r.json());

      const $lista = $('#lista_productos');
      $lista.empty();
      productos.forEach(p => {
        const $chk = $(`
          <div class="form-check">
            <input class="form-check-input" 
                   type="checkbox" 
                   name="id_producto[]" 
                   value="${p.id_producto}" 
                   id="prod_${p.id_producto}">
            <label class="form-check-label" for="prod_${p.id_producto}">
              ${p.nombre_producto}
            </label>
          </div>
        `);
        $lista.append($chk);
      });
    }

    // Filtro en tiempo real para productos
    $('#buscar_producto').on('input', function () {
      const term = $(this).val().toLowerCase();
      $('#lista_productos .form-check').each(function () {
        const label = $(this).find('label').text().toLowerCase();
        $(this).toggle(label.includes(term));
      });
    });

    // Filtro en tiempo real para categorías
    $('#buscar_categoria').on('input', function(){
      const term = $(this).val().toLowerCase();
      $('#lista_categorias .form-check').each(function(){
        const label = $(this).find('label').text().toLowerCase();
        $(this).toggle(label.includes(term));
      });
    });

    // Submit del formulario de Productos
    $('#form-descuento-producto').on('submit', async function(e){
      e.preventDefault();

      // Validaciones cliente
      const porc = parseFloat($('#porcentaje_prod').val());
      const ini  = new Date($('#inicio_prod').val());
      const fin  = new Date($('#fin_prod').val());

      const form = $(this);
      const data = form.serialize() + '&funcion=crear_descuento_producto';
      //console.log('🚀 serialized data:', data);

      const res = await fetch('../Controllers/DescuentoController.php', {
        method:'POST',
        headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
        body: data
      });
      const raw = await res.text();
      //console.log('🔴 RAW RESPONSE:', raw);

      let json;
      try {
        json = JSON.parse(raw);
      } catch (err) {
        //console.error('Respuesta inválida:', err);
        return Swal.fire('Error','Respuesta inválida del servidor.','error');
      }

      if (json.success) {
        $('#modal_descuento_producto').modal('hide');
        buscar_descuento_activos();
        form[0].reset();
        Swal.fire('Éxito','Descuento aplicado.','success');
      } else {
        Swal.fire('Error', json.error,'error');
      }
    });

    // Submit del formulario de categorías
    $('#form-descuento-categoria').on('submit', async function(e){
      e.preventDefault();
      const form = $(this);
      const data = form.serialize() + '&funcion=crear_descuento_categoria';  
      const res  = await fetch('../Controllers/DescuentoController.php', {
        method:'POST',
        headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
        body: data
      });
      const json = await res.json();
      if (json.success) {
        $('#modal_descuento_categoria').modal('hide');
        buscar_descuento_activos();
        form[0].reset();
        Swal.fire('¡Éxito!','Descuento aplicado a categorías.','success');
      } else {
        Swal.fire('Error', json.error || 'No se pudo guardar','error');
      }
    });

    // Al hacer click en editar:
    $('#tabla_descuentos').on('click', '.btn-editar', function () {
      const btn = $(this);

      $('#edt_id_prod').val(btn.data('id'));
      $('#edt_producto_prod').val(btn.data('producto'));
      $('#edt_porcentaje_prod').val(btn.data('porcentaje'));

      // Establecer la fecha y hora actual como valor de inicio
      const now = new Date();
      const pad2 = n => String(n).padStart(2, '0');
      const isoLocal = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}T${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
      $('#edt_inicio_prod').val(isoLocal);

      // Establecer el valor original del fin (sin modificarlo)
      const rawFin = btn.data('fin');
      const finVal = rawFin.replace(' ', 'T').slice(0, 16);
      $('#edt_fin_prod').val(finVal);

      // Configurar min en campos de fecha
      const $ini = $('#edt_inicio_prod'), $fin = $('#edt_fin_prod');
      setear_fecha_minima($ini, $fin);
      $ini.off('change').on('change', () => {
        if ($ini.val()) $fin.attr('min', $ini.val());
      });
    
      $('#modal_editar_descuento').modal('show');
    });

    // Submit del formulario de edición
    $('#form-editar-descuento').on('submit', async function(e){
      e.preventDefault();

      // Validaciones cliente edición
      const porc = parseFloat($('#edt_porcentaje').val());
      const ini  = new Date($('#edt_inicio').val());
      const fin  = new Date($('#edt_fin').val());
      const data = $(this).serialize() + '&funcion=editar_descuento'; 
      const res  = await fetch('../Controllers/DescuentoController.php', {
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: data
      });
      const json = await res.json();
      if (json.success) {
        $('#modal_editar_descuento').modal('hide');
        buscar_descuento_activos();
        Swal.fire('Actualizado','Descuento modificado.','success');
      } else {
        Swal.fire('Error', json.error,'error');
      }
    });

    // Al hacer click en eliminar:
    $('#tabla_descuentos').on('click', '.btn-eliminar', async function(){
      const id = $(this).data('id');
      Swal.fire({
            title: "¿Desea elminar el descuento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch('../Controllers/DescuentoController.php', {
                    method:'POST',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    body: `funcion=eliminar_descuento&id_descuento=${id}`
                });
                const json = await res.json();
                if (json.success) {
                    buscar_descuento_activos();
                    Swal.fire('Eliminado','Descuento borrado.','success');
                } else {
                    Swal.fire('Error', json.error,'error');
                }
            }
        })
    });
});
