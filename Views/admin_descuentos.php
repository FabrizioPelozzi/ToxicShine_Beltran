<?php include_once "Layouts/General/header.php"; ?>


<style>
    .d-flex.flex-wrap.mb-4 > .btn + .btn {
    margin-left: 0.5rem; /* ajusta el valor a tu gusto */
  }

  /* Opcional: si prefieres control más explícito */
  #btn-nuevo-producto {
    margin-right: 0.5rem;
  }
</style>


<title>Admin Descuentos | ToxicShineBeltrán</title>
<section class="content-header">
  <div class="container-fluid">
    <h1>Administrar Descuentos</h1>
  </div>
</section>

<!-- Modal: Descuento a Productos -->
<div class="modal fade" id="modal_descuento_producto" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <form id="form-descuento-producto">
        <input type="hidden" name="funcion" value="create_descuento_producto">
        <div class="modal-header">
          <h5 class="modal-title">Nuevo Descuento a Producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="text" class="form-control mb-2" id="buscar_producto" placeholder="Buscar producto...">
          <div id="lista_productos" style="max-height: 400px; overflow-y: auto;"></div>
          <div class="row mt-3">
            <div class="col-md-4">
              <label>Porcentaje</label>
              <input type="number"
                     id="porcentaje_prod"
                     name="porcentaje"
                     class="form-control"
                     min="1"         
                     max="100"       
                     step="0.01"
                     required>            
            </div>
            <div class="col-md-4">
              <label>Inicio</label>
              <input type="datetime-local"
                     id="inicio_prod"
                     name="inicio"
                     class="form-control"
                     required>            
            </div>
            <div class="col-md-4">
              <label>Fin</label>
              <input type="datetime-local"
                     id="fin_prod"
                     name="fin"
                     class="form-control"
                     required>            
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Guardar Descuento</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal: Descuento a Categorías -->
<div class="modal fade" id="modal_descuento_categoria" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <form id="form-descuento-categoria">
        <!-- Función para el controlador -->
        <input type="hidden" name="funcion" value="create_descuento_categoria">
        <div class="modal-header">
          <h5 class="modal-title">Nuevo Descuento a Categorías</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <!-- Buscador -->
          <input type="text" class="form-control mb-2" id="buscar_categoria" placeholder="Buscar categoría...">
          <!-- Lista de categorías -->
          <div id="lista_categorias" style="max-height: 400px; overflow-y: auto;"></div>

          <div class="row mt-3">
            <div class="col-md-4">
              <label>% Descuento</label>
              <input type="number" step="0.01" min="0" max="100" name="porcentaje" id="porcentaje_cat" class="form-control" required>
            </div>
            <div class="col-md-4">
              <label>Inicio</label>
              <input type="datetime-local" name="inicio" id="inicio_cat" class="form-control" required>
            </div>
            <div class="col-md-4">
              <label>Fin</label>
              <input type="datetime-local" name="fin" id="fin_cat" class="form-control" required>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-success">Guardar Descuento</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal: Editar Descuento -->
<div class="modal fade" id="modal_editar_descuento" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <form id="form-editar-descuento">
        <input type="hidden" name="funcion" value="update_descuento">
        <input type="hidden" name="id_descuento" id="edt_id_prod">
        <div class="modal-header">
          <h5 class="modal-title">Editar Descuento</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>Producto</label>
            <input type="text" id="edt_producto_prod" class="form-control" readonly>
          </div>
          <div class="mb-3">
            <label>% Descuento</label>
            <input type="number"
               id="edt_porcentaje_prod"
               name="porcentaje"
               class="form-control"
               min="1"         
               max="100"       
               step="0.01"
               required>
          </div>
          <div class="mb-3">
            <label>Inicio</label>
            <input type="datetime-local"
               id="edt_inicio_prod"
               name="inicio"
               class="form-control"
               required>
          </div>
          <div class="mb-3">
            <label>Fin</label>
            <input type="datetime-local"
               id="edt_fin_prod"
               name="fin"
               class="form-control"
               required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Guardar cambios</button>
        </div>
      </form>
    </div>
  </div>
</div>


<section class="content">
  <div class="container-fluid">

    <!-- Botones de acción -->
    <div class="d-flex flex-wrap gap-2 mb-4">
      <button id="btn-nuevo-producto" class="btn btn-success">
        <i class="fas fa-tag"></i> Nuevo descuento a producto
      </button>
      <button id="btn-nuevo-categoria" class="btn btn-primary">
        <i class="fas fa-tags"></i> Nuevo descuento por categoría
      </button>
    </div>

    <!-- Tabla de descuentos activos -->
    <div class="table-responsive">
      <table id="tabla_descuentos" class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>% Desc.</th>
            <th>Precio orig.</th>
            <th>Precio desc.</th>
            <th>Tiempo restante</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>

  </div>
</section>

<?php include_once "Layouts/General/footer.php"; ?>
<script src="admin_descuentos.js"></script>
