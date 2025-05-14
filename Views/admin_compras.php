<?php
    include_once "Layouts/General/header.php";
?>

<style>
  /* Contenedor que alinea buscador y botones */
  .busqueda-y-estados {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }

  /* Buscador con ancho limitado */
  .busqueda-y-estados .input-group {
    flex: 1 1 300px; /* permite crecer pero con mínimo de 300px */
    max-width: 400px;
  }

  /* Botones de estado */
  .estado-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

</style>

<!-- Modal para Detalle de Compra -->
<div class="modal fade" id="modalDetalleCompra" tabindex="-1" role="dialog" aria-labelledby="tituloModal" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
      </div>
      <div class="modal-body">
        <!-- Aquí se cargará el contenido dinámicamente -->
      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>


<title> Administrar Compras | ToxicShineBeltrán</title>
<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-12">
        <h1>Administrar Compras</h1> <br>

        <!-- Contenedor flex: buscador + botones de estado -->
        <div class="busqueda-y-estados mb-4">

          <!-- 1) Buscador por DNI -->
          <div class="input-group">
            <input type="text"
                   id="dni_busqueda"
                   class="form-control"
                   placeholder="Ingrese DNI del usuario">
            <button id="buscar_dni"
                    class="btn btn-primary d-none"
                    type="button">
              Buscar
            </button>
          </div>

          <!-- 2) Botones de estado -->
          <div class="estado-buttons">
            <button type="button" class="btn btn-info estado-filter" data-status="">Todos</button>
            <button type="button" class="btn btn-primary estado-filter" data-status="Pendiente">Pendiente</button>
            <button type="button" class="btn btn-success estado-filter" data-status="Entregado">Entregado</button>
            <button type="button" class="btn btn-danger estado-filter" data-status="Cancelado">Cancelado</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section class="content">
  <div class="card">
    <div class="card-body">
      <!-- Grid de compras -->
      <div id="compras" class="row"></div>
    </div>
  </div>
</section>


<?php
    include_once "Layouts/General/footer.php";
?>
<script src="admin_compras.js"></script>
