<?php
    include_once "Layouts/General/header.php";
?>

<!-- Modal para Detalle de Compra -->
<div class="modal fade" id="modalDetalleCompra" tabindex="-1" role="dialog" aria-labelledby="tituloModal" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="tituloModal">Detalle de la Compra</h5>
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


<title> Registro de Compras | ToxicShineBeltran</title>
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>Registro de Compras</h1> <br>

                <!-- 🔍 Buscador por DNI -->
                <div class="input-group mb-3">
                    <input type="text" id="dni_busqueda" class="form-control" placeholder="Ingrese DNI del usuario">
                    <button id="buscar_dni" class="btn btn-primary" type="button">Buscar</button>
                </div>

            </div>
        </div>
    </div>
</section>

<section class="content">
    <div class="card">
        <div class="card-body">
            <!-- 🧾 Tabla de compras -->
            <table id="compras" class="table table-hover">
                <thead>
                    <tr>
                        <th>Compras</th>
                    </tr>
                </thead>
            </table>
        </div>
        <!-- <div class="card-footer">
            Footer
        </div> -->
    </div>
</section>

<?php
    include_once "Layouts/General/footer.php";
?>
<script src="registro.js"></script>
