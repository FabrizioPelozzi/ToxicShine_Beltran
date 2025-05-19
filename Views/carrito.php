<?php
include_once "Layouts/General/header.php";
?>

<style>
  .carrito-item {
    transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    background-color: #fff;
  }

  .carrito-item:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .carrito-item .card-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
    height: 100%;
  }

  .carrito-info {
    flex: 1;
  }

  .carrito-img, .producto-img, .card-img-custom {
    width: 100%;
    max-width: 150px;
    height: 150px;
    object-fit: contain;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
    background-color: #f8f9fa;
    display: block;
    transition: transform 0.2s ease-in-out;
  }

  /* Cabecera celeste y texto oscuro */
  .carrito-item .card-header {
    background-color:rgb(67, 143, 224);
    /* color: #004085; */
    padding: 0.75rem 1rem;
  }

  .carrito-item .card-header h5 {
    margin: 0;
    font-size: 1.1rem;
  }

  /* Footer con botones alineados a la derecha */
  .carrito-item .card-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  @media (max-width: 767px) {
    /* Igual, pasa de fila a columna */
    .carrito-item .card-body {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
  
    /* Primero el info + controles */
    .carrito-item .carrito-info {
      order: 1;
    }
  
    /* Luego la imagen antes del footer */
    .carrito-item .carrito-img {
      order: 2;
      width: 100%;
      max-width: none;
      height: auto;
      margin: 0 auto;
    }
  }

</style>

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

<title>Mi Carrito | ToxicShineBeltran</title>

<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1>Mi Carrito</h1>
      </div>
    </div>
  </div>
</section>

<div class="row mb-3">
  <div class="container-fluid">
  <div class="col-12 col-md-4">
    <div class="input-group">
      <input
        type="text"
        id="buscar_carrito"
        class="form-control"
        placeholder="Buscar producto en el carrito…"
      >
    </div>
  </div>
  </div>
</div>
<br>

<section class="content">
  <div class="card">
    <div class="card-body">

    <!-- Tabla del carrito -->
    <div id="carrito" class="row"></div> <!-- cambia de tabla a contenedor de tarjetas -->

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
