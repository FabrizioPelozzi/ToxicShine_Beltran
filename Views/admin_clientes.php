<?php
    include_once "Layouts/General/header.php";
?>

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


<title> Administrar clientes | ToxicShineBeltran</title>
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-3">
                <h1>Administrar Clientes</h1> <br>

                <!-- 🔍 Buscador por DNI -->
                <div class="input-group mb-3">
                  <input type="text" id="dni_busqueda" class="form-control" placeholder="Ingrese DNI del usuario">
                  <!-- opcional: oculta el botón de buscar -->
                  <button id="buscar_dni" class="btn btn-primary d-none" type="button">Buscar</button>
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
<script src="admin_clientes.js"></script>
