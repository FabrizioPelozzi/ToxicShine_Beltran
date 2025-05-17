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
                buscar_descuentos_activas();
                setInterval(buscar_descuentos_activas, 60 * 1000);
                
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
    async function buscar_descuentos_activas() {
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
            descuentos.forEach(d => {
                const tiempoRestante = calcularTiempoRestante(d.fin);
                const precioDesc = (d.precio_orig * (1 - d.porcentaje / 100)).toFixed(2);
            
                const $tr = $(`
                  <tr>
                    <td>${d.producto}</td>
                    <td>${d.categoria}</td>
                    <td>${d.porcentaje}%</td>
                    <td>${d.precio_orig}$</td>
                    <td>${precioDesc}$</td>
                    <td class="vence-en" data-fin="${d.fin}">${tiempoRestante}</td>
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
    function calcularTiempoRestante(fin) {
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

    function setMinDateInputs($inicio, $fin) {
      const ahora = new Date();
      const pad2 = n => String(n).padStart(2,'0');
      const isoLocal = `${ahora.getFullYear()}-${pad2(ahora.getMonth()+1)}-${pad2(ahora.getDate())}`
                       + `T${pad2(ahora.getHours())}:${pad2(ahora.getMinutes())}`;
      $inicio.attr('min', isoLocal);
      $fin.attr('min', isoLocal);
    }

    // Abrir modal productos
    $('#btn-nuevo-producto').on('click', async () => {
      await cargarListaProductosMulti();
      const $ini = $('#inicio_prod'), $fin = $('#fin_prod');
      setMinDateInputs($ini, $fin);
      $ini.off('change').on('change', () => {
        if ($ini.val()) $fin.attr('min', $ini.val());
      });
      $('#modal_descuento_producto').modal('show');
    });

    // Abrir modal categorías
    $('#btn-nuevo-categoria').on('click', () => {
      cargarListaCategoriasMulti();
      $('#modal_descuento_categoria').modal('show');
    });

    // Llenar lista de categorías con checkboxes
    async function cargarListaCategoriasMulti() {
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
    async function cargarListaProductosMulti() {
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
        buscar_descuentos_activas();
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
        buscar_descuentos_activas();
        form[0].reset();
        Swal.fire('¡Éxito!','Descuento aplicado a categorías.','success');
      } else {
        Swal.fire('Error', json.error || 'No se pudo guardar','error');
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
                    buscar_descuentos_activas();
                    Swal.fire('Eliminado','Descuento borrado.','success');
                } else {
                    Swal.fire('Error', json.error,'error');
                }
            }
        })
    });

    // Al hacer click en editar:
    $('#tabla_descuentos').on('click', '.btn-editar', function(){
      const btn = $(this);

      $('#edt_id_prod').val(btn.data('id'));
      $('#edt_producto_prod').val(btn.data('producto'));
      $('#edt_porcentaje_prod').val(btn.data('porcentaje'));

      const rawIni = btn.data('inicio'); 
      const rawFin = btn.data('fin');
      const iniVal = rawIni.replace(' ', 'T').slice(0,16);  
      const finVal = rawFin.replace(' ', 'T').slice(0,16);
      $('#edt_inicio_prod').val(iniVal);
      $('#edt_fin_prod').val(finVal);

      const $ini = $('#edt_inicio_prod'), $fin = $('#edt_fin_prod');
      setMinDateInputs($ini, $fin);
      $ini.off('change').on('change', () => {
        if ($ini.val()) $fin.attr('min', $ini.val());
      });
    
      $('#modal_editar_descuento').modal('show');
    });


    // Al enviar el formulario de edición:
    $('#form-descuento-producto').on('submit', function(e){
      const porc = parseFloat($('#porcentaje_prod').val());
      const ini  = new Date($('#inicio_prod').val());
      const fin  = new Date($('#fin_prod').val());
    });

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
        buscar_descuentos_activas();
        Swal.fire('Actualizado','Descuento modificado.','success');
      } else {
        Swal.fire('Error', json.error,'error');
      }
    });
});
