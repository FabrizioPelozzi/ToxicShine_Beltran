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

<!-- Modal para Detalle de Compra (reutilizable) -->
<div class="modal fade" id="modalDetalleCompra" tabindex="-1" role="dialog" aria-labelledby="tituloModal" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
      </div>
      <div class="modal-body">
        <!-- Se cargará el detalle aquí -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<title>Mis Pedidos | ToxicShineBeltrán</title>
<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-12">
        <h1>Mis Pedidos</h1> <br>
        <div class="busqueda-y-estados mb-4">
          <!-- 1) Buscador por producto (reemplaza DNI) -->
          <div class="input-group">
            <input type="text"
                   id="buscar_producto"
                   class="form-control"
                   placeholder="Buscar por producto…">
          </div>

          <!-- 2) Botones de estado idénticos al admin -->
          <div class="estado-buttons">
            <button type="button"
                    class="btn btn-outline-primary btn-sm me-2 estado-filter"
                    data-status="">
              Todos
            </button>
            <button type="button"
                    class="btn btn-outline-primary btn-sm me-2 estado-filter"
                    data-status="Pendiente">
              Pendiente
            </button>
            <button type="button"
                    class="btn btn-outline-primary btn-sm me-2 estado-filter"
                    data-status="Entregado">
              Entregado
            </button>
            <button type="button"
                    class="btn btn-outline-primary btn-sm me-2 estado-filter"
                    data-status="Cancelado">
              Cancelado
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="content">
  <div class="card">
    <div class="card-body">
      <!-- Grid de pedidos exactamente igual -->
      <div id="compras" class="row g-4"></div>
    </div>
  </div>
</section>

<?php
    include_once "Layouts/General/footer.php";
?>
<script src="pedidos.js"></script>
