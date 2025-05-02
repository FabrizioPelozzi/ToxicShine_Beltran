<?php
include_once "Layouts/General/header.php";
?>

<!-- Modal Finalizar Carrito -->
<div class="modal fade" id="modalFinalizarCarrito" tabindex="-1" aria-labelledby="modalFinalizarCarritoLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalFinalizarCarritoLabel">Resumen de Compra</h5>
      </div>
      <div class="modal-body">
        <div id="resumen_carrito"></div>
        <!-- Puedes mantener este h4 para mostrar el total si lo deseas; aquí se actualiza el texto -->
        <h4 id="monto_total_span" style="visibility: visible;"></h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="ir_a_pagar">Ir a pagar</button>
      </div>
    </div>
  </div>
</div>

<title>Carrito | ToxicShineBeltran</title>

<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1>Carrito</h1>
      </div>
    </div>
  </div>
</section>

<section class="content">
  <div class="card">
    <div class="card-body">
      <table id="carrito" class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Producto</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="card-footer">
      <div id="total_grand" class="text-right">
        <h4><span id="total_carrito"></span></h4>
      </div>
    </div>
  </div>
</section>

<?php
include_once "Layouts/General/footer.php";
?>
<script src="carrito.js"></script>
